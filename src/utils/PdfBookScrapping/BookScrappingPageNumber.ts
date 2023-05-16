import { chromium } from "playwright";
const { spawnSync } = require("child_process");

export const bookScrappingPageNumber = async (): Promise<any> => {
    spawnSync("npx", ["playwright", "install", "chromium"]);
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log("Started Scrap");
            const timeout = 0;
            const browser = await chromium.launch({
                headless: true
            });
            const context = await browser.newContext();

            context.setDefaultNavigationTimeout(timeout)
            context.setDefaultTimeout(timeout)

            const page = await context.newPage();
            await page.goto("https://yes-pdf.com/books", { waitUntil: 'load', timeout: timeout })
            await page.waitForTimeout(2000);
            const lastPageNumber = await page.$$eval('.pagination .page-item a', (links) => {
                const lastLink = links[links.length - 1];
                const href = (lastLink as HTMLAnchorElement).href;
                const pageNumber = href.split('/books/page/')[1];
                return pageNumber;
            });

            console.log(lastPageNumber);

            const result = { lastPageNumber, page, browser }
            resolve(result);

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}