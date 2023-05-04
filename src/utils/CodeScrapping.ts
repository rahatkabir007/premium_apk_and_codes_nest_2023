import { readFileSync, writeFileSync } from "fs";
import { chromium } from "playwright";
const { spawnSync } = require("child_process");
const codeDatasArray: any = [];


const timeout = 1000 * 60 * 10

export const codeScrapping = (lastDate) => {
    spawnSync("npx", ["playwright", "install", "chromium"]);
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Started Scrap");
            const browser = await chromium.launch({ headless: false, timeout: timeout });
            const context = await browser.newContext();

            context.setDefaultNavigationTimeout(timeout)
            context.setDefaultTimeout(timeout)

            const page = await context.newPage();
            // let pageNumber = readFileSync("./codePageNumber").toString()
            // let parsedPageNumber = parseInt(pageNumber)
            // if (pageNumber === "") {
            //     parsedPageNumber = 1
            // }
            await page.goto("https://codelist.cc/en/")
            await page.waitForTimeout(2000);
            const lastLinkNumber = await page.$$eval('.bottom-navi .navigations a', (elements) => {
                const lastLink = elements[elements.length - 1];
                const lastLinkValue = lastLink.textContent.trim();
                const lastLinkNumber = parseInt(lastLinkValue, 10);
                return lastLinkNumber;
            });

            // for (var i = parsedPageNumber; i < 2; i++){
            for (var i = lastLinkNumber; i >= 1; i--) {
                console.log("Going to the page", i);
                await page.waitForTimeout(10000)
                await page.goto(`https://codelist.cc/pgs/${i}/`);

                const NextStep = await page.evaluate(() => {
                    const elements = document.querySelectorAll('.post--vertical .post__text .post__meta a time');
                    const texts = [];
                    for (let i = 0; i < elements.length; i++) {
                        texts.push(elements[i].textContent);
                    }
                    console.log(texts);
                    return texts
                })
                const pageChange = () => {
                    let text = []
                    for (let j = 0; j < NextStep.length; j++) {
                        console.log(NextStep[j]);
                        if (new Date(lastDate) > new Date(NextStep[j] || null)) {
                            text.push(true)
                        }
                        else {
                            text.push(false)
                        }
                    }
                    return text
                }

                console.log('pageChange()', pageChange())
                if (pageChange().filter(value => value === true).length === NextStep.length) {
                    continue
                }
                await page.waitForTimeout(2000)
                const codeDatas = await page.$$eval('.post--vertical', (codeData) => {
                    return codeData.map((el) => {
                        const url = el.querySelector('.post__thumb a')?.getAttribute('href') ?? '';
                        const title = el.querySelector('.post__text .post__title a')?.textContent?.trim() ?? '';
                        const description = el.querySelector('.post__text .post__excerpt')?.textContent?.trim() ?? '';
                        const imgSrc = el.querySelector('img')?.src ?? '';
                        const category = el.querySelector('.post__text .post__meta span a')?.textContent?.trim() ?? '';
                        const date = el.querySelector('.post__text .post__meta a time')?.textContent?.trim() ?? '';

                        return { url, title, description, imgSrc, category, date };
                    });
                });
                if (codeDatas.length === 0) {
                    break;
                }
                // writeFileSync("./codePageNumber", i.toString())
                for (let k = codeDatas.length - 1; k >= 0; k--) {
                    console.log('going to details page', k);
                    const codeObj: any = {}
                    await page.waitForTimeout(5000)
                    await page.goto(codeDatas[k].url)
                    await page.waitForTimeout(2000)
                    const title = codeDatas[k].title;
                    const description = codeDatas[k].description;
                    const img = codeDatas[k].imgSrc;
                    let category = codeDatas[k].category;
                    if (category.includes("/")) {
                        const parts = category.split("/");
                        category = parts[1]
                    }
                    const date = codeDatas[k].date;
                    const nullorTextDate = date || null;
                    const dateC = new Date(nullorTextDate);
                    const dateL = new Date(lastDate)
                    if (dateL > dateC) {
                        continue;
                    }
                    const mongoDbDate = dateC.toISOString();
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
                    await page.waitForTimeout(5000);
                    if (linkText.includes("codecanyon")) {
                        console.log("going to codecanyon");
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

                            return htmlContent === null ? "" : htmlContent;
                        });
                        codeObj.title = title;
                        codeObj.description = description;
                        codeObj.img = img;
                        codeObj.category = category;
                        codeObj.date = date;
                        codeObj.mongoDbDate = mongoDbDate;
                        codeObj.url = linkText
                        codeObj.downloadLinks = downloadLinks;
                        codeObj.htmlContent = htmlContent || "";
                        codeDatasArray.push(codeObj)
                        // codecanyon scrap finish
                    }
                    else {
                        codeObj.title = title;
                        codeObj.description = description;
                        codeObj.img = img;
                        codeObj.category = category;
                        codeObj.date = date;
                        codeObj.mongoDbDate = mongoDbDate;
                        codeObj.url = linkText
                        codeObj.downloadLinks = downloadLinks;
                        codeDatasArray.push(codeObj)
                    }
                }
            }
            console.log("finish scrap");
            resolve(codeDatasArray)
        }

        catch (error) {

            console.log("finish scrap catch");
            resolve(codeDatasArray)
            console.log('eeee', error)
        }

    })
}