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


            const result = { page }
            resolve(result);

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}