import { chromium } from "playwright";
const { spawnSync } = require("child_process");

const timeout = 1000 * 60 * 10;

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
            const elements = await page.$$('.allbanglanewspaperslogo');
            const result = await Promise.all(elements.map((element) => {
                return page.evaluate((el) => {
                    const a = el.querySelector('a');
                    const div = el.querySelector('div');
                    const img = el.querySelector('img');
                    const title = img ? img.getAttribute('title') : null;
                    return { a, div, title };
                }, element);
            }));
            console.log("🚀 ~ file: NewspaperScrapHomepage.ts:30 ~ result ~ result:", result)



            // resolve(result);

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}