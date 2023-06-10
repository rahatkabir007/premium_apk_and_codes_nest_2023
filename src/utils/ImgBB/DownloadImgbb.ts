// export async function downloadImageImgbb(page, imgurl) {

//     console.log('imgurl', imgurl)
//     await page.goto(imgurl);

//     // Extract the first src attribute value from the div elements
//     const firstSrc = await page.evaluate(() => {
//         const y = document.getElementsByTagName('img')[0]?.src || document.getElementsByTagName('iframe')[0].src
//         console.log('y', y)
//         return y
//     })
//     console.log('firstSrc', firstSrc);

//     await page.goto(firstSrc);

//     // const ext = ext.replace(".", "")
//     await page.evaluate((link) => {
//         function download(firstSrc, filename) {
//             fetch(firstSrc)
//                 .then(response => response.blob())
//                 .then(blob => {
//                     const link = document.createElement("a");
//                     link.href = URL.createObjectURL(blob);
//                     link.download = filename;
//                     link.click();
//                 })
//                 .catch(console.error);
//         }

//         download(link, "any")
//     }, firstSrc)

//     const [download] = await Promise.all([
//         page.waitForEvent('download', { timeout: 600000 }),
//     ]);
//     const saveAsStr = `./image.jpg`
//     await download.saveAs(saveAsStr)
//     await page.waitForTimeout(2000)

//     await page.goto('https://imgbb.com');
//     const inputHandle = await page.$('input[type=file]');
//     await inputHandle.setInputFiles('./image.jpg');
//     await page.click('button.btn.btn-big.green[data-action="upload"]');

//     await page.waitForSelector(".switch-combo");

//     // Click the "copy" button
//     await page.click(".switch-combo button[data-action='copy']");

//     // Wait for the clipboard event to be triggered
//     //   await page.waitForEvent("clipboard");
//     await page.waitForTimeout(5000)

//     // Get the copied value from the clipboard
//     const copiedValue = await page.evaluate(() => navigator.clipboard.readText());

//     console.log("Copied value:", copiedValue);
//     await page.waitForTimeout(2000)
//     await page.goto(copiedValue)


//     const embedCode = await page.$eval('#embed-code-2', (input) => input.value);

//     console.log('Embed code:', embedCode);

//     const urlRegex = /<img\s+src="([^"]+)"/i;

//     // Extract the URL from the input string using the regex pattern
//     const match = embedCode.match(urlRegex);

//     // Retrieve the captured URL from the match result
//     const imageUrl = match ? match[1] : null;

//     console.log('Image URL:', imageUrl);



//     return imageUrl
// }


import { chromium } from "playwright";
const { spawnSync } = require("child_process");

const timeout = 600000;

export const downloadImageImgbb = async (imgurl): Promise<any> => {
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

            console.log('imgurl', imgurl)
            await page.goto(imgurl);

            // Extract the first src attribute value from the div elements
            const firstSrc = await page.evaluate(() => {
                const y = document.getElementsByTagName('img')[0]?.src || document.getElementsByTagName('iframe')[0].src
                console.log('y', y)
                return y
            })
            console.log('firstSrc', firstSrc);

            await page.goto(firstSrc);

            // const ext = ext.replace(".", "")
            await page.evaluate((link) => {
                function download(firstSrc, filename) {
                    fetch(firstSrc)
                        .then(response => response.blob())
                        .then(blob => {
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = filename;
                            link.click();
                        })
                        .catch(console.error);
                }

                download(link, "any")
            }, firstSrc)

            const [download] = await Promise.all([
                page.waitForEvent('download', { timeout: 600000 }),
            ]);
            const saveAsStr = `./image.jpg`
            await download.saveAs(saveAsStr)
            await page.waitForTimeout(2000)

            await page.goto('https://imgbb.com');
            const inputHandle = await page.$('input[type=file]');
            await inputHandle.setInputFiles('./image.jpg');
            await page.click('button.btn.btn-big.green[data-action="upload"]');

            await page.waitForSelector(".switch-combo");

            // Click the "copy" button
            await page.click(".switch-combo button[data-action='copy']");

            // Wait for the clipboard event to be triggered
            //   await page.waitForEvent("clipboard");
            await page.waitForTimeout(5000)

            // Get the copied value from the clipboard
            const copiedValue = await page.evaluate(() => navigator.clipboard.readText());

            console.log("Copied value:", copiedValue);
            await page.waitForTimeout(2000)
            await page.goto(copiedValue)


            const embedCode = await page.$eval('#embed-code-2', (input) => (input as HTMLInputElement).value);

            console.log('Embed code:', embedCode);

            const urlRegex = /<img\s+src="([^"]+)"/i;

            // Extract the URL from the input string using the regex pattern
            const match = embedCode.match(urlRegex);

            // Retrieve the captured URL from the match result
            const imageUrl = match ? match[1] : null;

            console.log('Image URL:', imageUrl);
            resolve(imageUrl);
            await browser.close();

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}