import { chromium } from "playwright";
const { spawnSync } = require("child_process");

const timeout = 1000 * 60 * 10;

export const apkScrappingPageNumber = async (): Promise<any> => {
    spawnSync("npx", ["playwright", "install", "chromium"]);
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log("Started Scrap");
            const browser = await chromium.launch({ headless: false, timeout: timeout });
            const context = await browser.newContext();

            context.setDefaultNavigationTimeout(timeout)
            context.setDefaultTimeout(timeout)

            
            const page = await context.newPage();
            await page.goto('https://www.revdl.com');
            await page.waitForTimeout(3000);
            // await page.goto("https://codelist.cc/en/")
            // await page.waitForTimeout(2000);
            let totalP = await page.evaluate(() => {
                const dotsSpan = document.querySelector('.page-numbers.dots');
                const nextDivText = dotsSpan.nextElementSibling.textContent;
                console.log('nextDivText', nextDivText)
                return parseInt(nextDivText.replace(',', ''))
              })
            const result = { totalP, page,context }
            resolve(result);

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}