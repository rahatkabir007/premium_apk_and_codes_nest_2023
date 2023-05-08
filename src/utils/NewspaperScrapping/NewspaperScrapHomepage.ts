import { chromium } from "playwright";
const { spawnSync } = require("child_process");

const timeout = 1000 * 60 * 10;

interface newspaperobject {
    newspaperName: string;
    img: string;
    category: string;
    url: string
}

export const newspaperDataScrapping = async (): Promise<any> => {
    spawnSync("npx", ["playwright", "install", "chromium"]);
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log("Started Scrapping Newspaper");
            const browser = await chromium.launch({ headless: false, timeout: timeout });
            const context = await browser.newContext();

            context.setDefaultNavigationTimeout(timeout)
            context.setDefaultTimeout(timeout)

            const page = await context.newPage();
            await page.goto("https://www.allbanglanewspaper.xyz/")
            await page.waitForTimeout(2000);

            //online newspaper
            const onlineData = await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('.allbanglanewspaperslogo'));
                const result = [];
                for (const item of items) {
                    try {
                        const divTag = item.querySelector('div');
                        const newspaperName = divTag.textContent.trim() || "";
                        const aTag = item.querySelector('a');
                        const imgTag = aTag.querySelector('img');
                        const imageUrl = imgTag.getAttribute('src');
                        const newImageUrl = getImg(imageUrl);
                        const category = "onlineNewspaper"
                        const url = imgTag.getAttribute('title')
                        const newspaper = {
                            newspaperName,
                            newImageUrl,
                            category,
                            url
                        }
                        if (aTag && imgTag && divTag) {
                            result.push(newspaper)
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }

                return result;
            });

            await page.goto("https://www.allbanglanewspaper.xyz/bangladesh/sharebazarnewspaper")

            console.log(onlineData);



            // resolve();

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}

const getImg = (url) => {
    url.replace('.', 'https://www.allbanglanewspaper.xyz');
}