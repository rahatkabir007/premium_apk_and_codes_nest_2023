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
            const onlineNewspaperData = await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('.allbanglanewspaperslogo'));
                const result = [];
                for (const item of items) {
                    try {
                        const divTag = item.querySelector('div');
                        const newspaperName = divTag.textContent.trim() || "";
                        const aTag = item.querySelector('a');
                        const imgTag = aTag.querySelector('img');
                        const imageUrl = imgTag.getAttribute('src');
                        const img = imageUrl.replace('.', 'https://www.allbanglanewspaper.xyz');
                        const category = "onlineNewspaper"
                        const url = imgTag.getAttribute('title')
                        const newspaper = {
                            newspaperName,
                            img,
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

            console.log(onlineNewspaperData);

            await page.waitForTimeout(2000);

            //sharebazar newspaper
            await page.goto("https://www.allbanglanewspaper.xyz/bangladesh/sharebazarnewspaper");
            const sharebazarnewspaperData = await page.evaluate(() => {
                const result = [];
                const items = Array.from(document.querySelectorAll('.allbanglanewspaperslogo'));
                for (const item of items) {
                    try {
                        const divTag = item.querySelector('div');
                        const newspaperName = divTag.textContent.trim() || "";
                        const aTag = item.querySelector('a');
                        const imgTag = aTag.querySelector('img');
                        const imageUrl = imgTag.getAttribute('src');
                        const img = imageUrl.replace('.', 'https://www.allbanglanewspaper.xyz');
                        const category = "sharebazarnewspaper"
                        const url = imgTag.getAttribute('title')
                        const newspaper = {
                            newspaperName,
                            img,
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
                const items2 = Array.from(document.querySelectorAll('.newspapers-list-item'));
                for (const item of items2) {
                    try {
                        const aTag = item.querySelector('a');
                        const imgTag = aTag.querySelector('img');
                        const imageUrl = imgTag.getAttribute('src');
                        const img = imageUrl.replace('.', 'https://www.allbanglanewspaper.xyz');
                        const category = "sharebazarnewspaper"
                        const url = imgTag.getAttribute('title')
                        const newspaper = {
                            img,
                            category,
                            url
                        }
                        if (aTag && imgTag) {
                            result.push(newspaper)
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
                return result;
            });
            console.log("🚀 ~ file: NewspaperScrapHomepage.ts:95 ~ sharebazarnewspaperData ~ sharebazarnewspaperData:", sharebazarnewspaperData)




            // resolve();

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}

