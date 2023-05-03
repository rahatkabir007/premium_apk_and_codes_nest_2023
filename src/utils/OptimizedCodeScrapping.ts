import { readFileSync, writeFileSync } from "fs";
import { chromium, Page } from "playwright";
const { spawnSync } = require("child_process");

const timeout = 1000 * 60 * 10;

export const codeScrapping = async (): Promise<any[]> => {
    spawnSync("npx", ["playwright", "install", "chromium"]);

    const codeDatasArray: any[] = [];
    let pageNumber = readFileSync("./codePageNumber", "utf-8").trim();
    let parsedPageNumber = pageNumber ? parseInt(pageNumber) : 1;

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.setDefaultNavigationTimeout(timeout);
    page.setDefaultTimeout(timeout);

    try {
        for (let i = parsedPageNumber; i < 3; i++) {
            console.log("Going to page", i);
            await page.goto(`https://codelist.cc/pgs/${i}/`);
            await page.waitForSelector('.post--vertical');

            const codeDatas = await page.$$eval('.post--vertical', (elements) => {
                return elements.map((el) => {
                    const url = el.querySelector('.post__thumb a')?.getAttribute('href');
                    const title = el.querySelector('.post__text .post__title a')?.textContent?.trim();
                    const description = el.querySelector('.post__text .post__excerpt')?.textContent?.trim();
                    const imgSrc = el.querySelector('img')?.src;
                    const category = el.querySelector('.post__text .post__meta span a')?.textContent?.trim();
                    const date = el.querySelector('.post__text .post__meta a time')?.textContent?.trim();

                    return { url, title, description, imgSrc, category, date };
                });
            });

            if (codeDatas.length === 0) {
                break;
            }

            writeFileSync("./codePageNumber", i.toString());

            for (let j = 0; j < codeDatas.length; j++) {
                console.log('Going to details page', j);
                const codeObj: any = {};

                await page.goto(codeDatas[j].url);
                await page.waitForSelector('.quote');

                const title = codeDatas[j].title;
                const description = codeDatas[j].description;
                const img = codeDatas[j].imgSrc;
                const category = codeDatas[j].category;
                const date = codeDatas[j].date;

                const downloadLinks = await getDownloadLinks(page);

                if (codeDatas[j].url.includes("https://codecanyon.net")) {
                    console.log("Going to codecanyon");
                    await page.goto(codeDatas[j].url);
                    await page.waitForSelector('.user-html');

                    const htmlContent = await getHTMLContent(page);
                    codeObj.htmlContent = htmlContent || "";
                }

                codeObj.title = title;
                codeObj.description = description;
                codeObj.img = img;
                codeObj.category = category;
                codeObj.date = date;
                codeObj.url = codeDatas[j].url;
                codeObj.downloadLinks = downloadLinks;

                codeDatasArray.push(codeObj);
            }
        }

        console.log("Finished scrap");
    } catch (error) {
        console.error("Error occurred during scrap:", error);
    } finally {
        await browser.close();
    }

    return codeDatasArray;
};

async function getDownloadLinks(page: Page): Promise<string[]> {
    const downloadLinks = await page.$$eval('.quote', (elements) => {
        const links = Array.from(elements[0].querySelectorAll('a'));
        return links.map((link) => link.textContent.trim());
    });

    return downloadLinks.filter((link) => link !== "");
}
async function getHTMLContent(page: Page): Promise<string | null> {
    const htmlContent = await page.$eval('.user-html', (element) => {
        let html = element?.innerHTML || "";
        html = html.replace(/\n/g, '');
        html = html.replace(/<span([^>]*)data-src="([^"]*)"([^>]*)data-alt="([^"]*)"[^>]*><\/span>/g, '<img$1src="$2"$3alt="$4">');
        return html || null;
    });

    return htmlContent;
}