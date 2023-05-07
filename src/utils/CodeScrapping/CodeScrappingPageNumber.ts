import { chromium } from "playwright";
const { spawnSync } = require("child_process");



export const codeScrappingPageNumber = async (): Promise<any> => {
    spawnSync("npx", ["playwright", "install", "chromium"]);
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log("Started Scrap");
            const timeout = 60000;
            const browser = await chromium.launch({
                headless: true, timeout: timeout,
            });
            const context = await browser.newContext();

            context.setDefaultNavigationTimeout(timeout)
            context.setDefaultTimeout(timeout)

            const page = await context.newPage();
            await page.goto("https://codelist.cc/en/")
            await page.waitForTimeout(2000);
            const lastLinkNumber: number = await page.$$eval('.bottom-navi .navigations a', (elements) => {
                const lastLink = elements[elements.length - 1];
                const lastLinkValue = lastLink.textContent.trim();
                const lastLinkNumber = parseInt(lastLinkValue, 10);
                return lastLinkNumber;
            });
            const result = { lastLinkNumber, page }
            resolve(result);

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}