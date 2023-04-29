import { readFileSync, writeFileSync } from "fs";
import { chromium } from "playwright";

const codeDatasArray: any = [];

export const codeScrapping = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await chromium.launch({ headless: false });
            const context = await browser.newContext();
            const page = await context.newPage();
            let pageNumber = readFileSync("./codePageNumber").toString()
            let parsedPageNumber = parseInt(pageNumber)
            if (pageNumber === "") {
                parsedPageNumber = 1
            }
            // for (var i = parsedPageNumber; i < 2; i++){
            for (var i = parsedPageNumber; ; i++) {
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
                    const url = codeDatas[j].url
                    const downloadLinks = await page.evaluate(() => {
                        //@ts-ignore
                        const downloadLinksArr = document.getElementsByClassName('quote')[0].innerText.split("\n")
                        return downloadLinksArr.filter((item) => item !== "");
                    })
                    codeObj.title = title;
                    codeObj.description = description;
                    codeObj.img = img;
                    codeObj.category = category;
                    codeObj.date = date;
                    codeObj.url = url
                    codeObj.downloadLinks = downloadLinks;
                    codeDatasArray.push(codeObj)
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