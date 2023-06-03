import { chromium } from "playwright";
const { spawnSync } = require("child_process");

const timeout = 600000;

export const hustlePageImgbbPage = async (): Promise<any> => {
    spawnSync("npx", ["playwright", "install", "chromium"]);
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log("Started Scrap");
            const browser = await chromium.launch({ headless: false, timeout: timeout });
            const context = await browser.newContext();
            await context.route("**/*", (request) => {
                request.request().url().startsWith("https://googleads.")
                    ? request.abort()
                    : request.continue();
                return;
            });

            //having clipboard(copy paste permission bt default)
            await context.grantPermissions(['clipboard-read', 'clipboard-write']);
            context.setDefaultNavigationTimeout(timeout)
            context.setDefaultTimeout(timeout)


            const page = await context.newPage();
            // await page.goto('https://www.freecoursesonline.me/?10');
            // await page.waitForTimeout(3000);
            // // await page.goto("https://codelist.cc/en/")
            // // await page.waitForTimeout(2000);
            // let totalP = await page.evaluate(() => {
            //     const lastPage = document.getElementsByClassName('page-numbers')[3].textContent
            //     // const nextDivText = dotsSpan.nextElementSibling.textContent;
            //     // console.log('nextDivText', nextDivText)
            //     // return parseInt(nextDivText.replace(',', ''))
            //     return parseInt(lastPage)
            // })
            const result = { page }
            resolve(result);

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}