import { chromium } from "playwright";
const fs = require('fs');

export async function downloadImage(page, imgurl) {
    // Launch the browser and create a new page
    // const browser = await chromium.launch({ headless: false });
    // const context = await browser.newContext();
    // const page = await context.newPage();

    // await page.goto('http://web.archive.org/web/20220925081246im_/https://sidehustlestack.co/_next/image?url=https%3A%2F%2Fsuper-static-assets.s3.amazonaws.com%2Ffe3e1885-4c3e-4d4f-9dd3-ad4cee841cf8%2Fimages%2F96a50aa9-ac47-4238-b427-157e31a237de.png&w=1920&q=80');
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

    // Get the image buffer
    const imageBuffer1 = await page.screenshot();
    const filePath = './image.jpg';

    // Save the image buffer to a file
    await fs.promises.writeFile(filePath, imageBuffer1);


    // Set the destination file path to save the image
    const destinationPath = './image.jpg';

    await page.goto('https://imgbb.com');
    const inputHandle = await page.$('input[type=file]');
    await inputHandle.setInputFiles(destinationPath);
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
    await page.goto(copiedValue)


    const embedCode = await page.$eval('#embed-code-2', (input) => input.value);

    console.log('Embed code:', embedCode);

    const urlRegex = /<img\s+src="([^"]+)"/i;

    // Extract the URL from the input string using the regex pattern
    const match = embedCode.match(urlRegex);

    // Retrieve the captured URL from the match result
    const imageUrl = match ? match[1] : null;

    console.log('Image URL:', imageUrl);

    // Click the copy button
    // await page.click('button[data-action="copy"][data-action-target="#embed-code-2"]');

    // const copiedValueReal = await page.evaluate(() => navigator.clipboard.readText());

    return imageUrl

    // // Wait for the upload to complete
    // await page.waitForSelector("#uploaded-embed-code-1");
    // const textareaValue = await page.$eval("#uploaded-embed-code-1", (textarea) => textarea.textContent);

    // console.log("Textarea value:", textareaValue);

    //   await browser.close();

    //   // Return the destination file path
    //   return destinationPath;
}



