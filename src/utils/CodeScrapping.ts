import { readFileSync, writeFileSync } from "fs";
import { chromium } from "playwright";
const { spawnSync } = require("child_process");
const codeDatasArray: any = [];

export const codeScrapping = () => {
    spawnSync("npx", ["playwright", "install", "chromium"]);
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await chromium.launch({ headless: true });
            const context = await browser.newContext();
            const page = await context.newPage();
            let pageNumber = readFileSync("./codePageNumber").toString()
            let parsedPageNumber = parseInt(pageNumber)
            if (pageNumber === "") {
                parsedPageNumber = 1
            }
            // for (var i = parsedPageNumber; i < 2; i++){
            for (var i = parsedPageNumber; ; i++) {
                await page.waitForTimeout(10000)
                await page.goto(`https://codelist.cc/pgs/${i}/`);
                await page.waitForTimeout(2000)
                const codeDatas = await page.$$eval('.post--vertical', (codeData) => {
                    return codeData.map((el) => {

                        const url = el.querySelector('.post__thumb a').getAttribute('href');
                        const title = el.querySelector('.post__text .post__title a').textContent.trim();
                        const description = el.querySelector('.post__text .post__excerpt').textContent.trim();
                        // const imgSrc = await page.locator('.attachment-featured_image').getAttribute('data-src') || ''
                        const imgSrc = el.querySelector('img').src;
                        const category = el.querySelector('.post__text .post__meta span a').textContent.trim();
                        const date = el.querySelector('.post__text .post__meta a time').textContent.trim();

                        return { url, title, description, imgSrc, category, date };
                    });
                });
                if (codeDatas.length === 0) {
                    break;
                }
                writeFileSync("./codePageNumber", i.toString())
                for (var j = 0; j < codeDatas.length; j++) {
                    const codeObj: any = {}
                    await page.waitForTimeout(2000)
                    await page.goto(codeDatas[j].url)
                    await page.waitForTimeout(2000)
                    const title = codeDatas[j].title;
                    const description = codeDatas[j].description;
                    const img = codeDatas[j].imgSrc;
                    const category = codeDatas[j].category;
                    const date = codeDatas[j].date;
                    const downloadLinks = await page.evaluate(() => {
                        //@ts-ignore
                        const downloadLinksArr = document.getElementsByClassName('quote')[0].innerText.split("\n")
                        return downloadLinksArr.filter((item) => item !== "");
                    })

                    //codecanyon scrap
                    const linkText = await page.evaluate(() => {
                        const link = document.querySelector('.single-body a');
                        return link.textContent;
                    });
                    await page.waitForTimeout(2000);
                    if (linkText.includes("https://codecanyon.net")) {

                        await page.goto(linkText);
                        await page.waitForTimeout(2000);

                        const htmlContent = await page.evaluate(() => {
                            const element = document.querySelector('.user-html'); // replace "your-class" with your class name
                            if (!element) {
                                return null; // Return null if the element is not found 
                            }
                            let htmlContent = element.innerHTML;

                            // Replace newline characters with <br/>
                            htmlContent = htmlContent.replace(/\n/g, '');

                            // Replace <span> elements with <img> elements
                            htmlContent = htmlContent.replace(/<span([^>]*)data-src="([^"]*)"([^>]*)data-alt="([^"]*)"[^>]*><\/span>/g, '<img$1src="$2"$3alt="$4">');

                            return htmlContent || "";
                        });
                        codeObj.title = title;
                        codeObj.description = description;
                        codeObj.img = img;
                        codeObj.category = category;
                        codeObj.date = date;
                        codeObj.url = linkText
                        codeObj.downloadLinks = downloadLinks;
                        codeObj.htmlContent = htmlContent || "";
                        codeDatasArray.push(codeObj)
                        // codecanyon scrap
                    }
                    else {
                        codeObj.title = title;
                        codeObj.description = description;
                        codeObj.img = img;
                        codeObj.category = category;
                        codeObj.date = date;
                        codeObj.url = linkText
                        codeObj.downloadLinks = downloadLinks;
                        codeDatasArray.push(codeObj)
                    }
                }
            }
            resolve(codeDatasArray)
        }

        catch (error) {
            resolve(codeDatasArray)
            console.log('eeee', error)
        }

    })
}