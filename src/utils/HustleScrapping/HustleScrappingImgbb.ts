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

    // // Enable download events
    // await page.on('download', (download) => {
    //     // Specify the destination file path to save the downloaded image
    //     const destinationPath = './image.jpg';

    //     // Save the downloaded file to the destination path
    //     download.saveAs(destinationPath);
    // });

    // Navigate to the URL
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
    // resolve(true)


    // Wait for the download to finish
    // await download.finished();

    // await page.goto(firstSrc);

    // // Get the image buffer
    // const imageBuffer1 = await page.screenshot();
    // const filePath = './image.jpg';

    // // Save the image buffer to a file
    // await fs.promises.writeFile(filePath, imageBuffer1);


    // // Set the destination file path to save the image
    // const destinationPath = './image.jpg';

    await page.goto('https://imgbb.com');
    const inputHandle = await page.$('input[type=file]');
    await inputHandle.setInputFiles('./image.jpg');
    await page.click('button.btn.btn-big.green[data-action="upload"]');

    await page.waitForSelector(".switch-combo");

    // Click the "copy" button
    await page.click(".switch-combo button[data-action='copy']");

    // Wait for the clipboard event to be triggered
    //   await page.waitForEvent("clipboard");
    await page.waitForTimeout(10000)

    // Get the copied value from the clipboard
    const copiedValue = await page.evaluate(() => navigator.clipboard.readText());

    console.log("Copied value:", copiedValue);
    await page.waitForTimeout(2000)
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



// import { chromium } from "playwright";
// const { spawnSync } = require("child_process");

// const fs = require('fs');
// let delay = ms => new Promise(res => setTimeout(res, ms));
// const timeout = 1000 * 60 * 10;
// var HustleScrapDataArray: any = [];

// export const hustleScrapping = async (): Promise<any> => {
//     spawnSync("npx", ["playwright", "install", "chromium"]);
//     return new Promise<any>(async (resolve, reject) => {
//         try {
//             console.log("Started Scrap");
//             const browser = await chromium.launch({ headless: false, timeout: timeout });
//             const context = await browser.newContext();
//             context.setDefaultNavigationTimeout(timeout)
//             context.setDefaultTimeout(timeout)
//             const page = await context.newPage();
//             await page.goto('http://web.archive.org/web/20221212190828/https://sidehustlestack.co/');
//             await page.waitForTimeout(10000);
//             const allHuss = await page.evaluate(async () => {

//                 const h = document.getElementsByClassName('notion-collection-gallery medium');
//                 const hrefs = [];

//                 // for (let i = 0; i < h.length; i++) {
//                 const aTags = h[1].getElementsByTagName('a');
//                 for (let j = 0; j < aTags.length; j++) {
//                     hrefs.push(aTags[j].href);
//                 }
//                 // }

//                 return hrefs;
//             })

//             const allHustles = allHuss
//             console.log('allHustles', allHustles)

//             // for (let i = 0; i < allHustles.length; i++) {
//             for (let i = 217; i < 230; i++) {
//                 const u = 'http://web.archive.org/web/20221212190828/';
//                 const z = allHustles[i];
//                 const url = u.concat(z);
//                 console.log('url2', z);
//                 console.log('url', url);

//                 await page.goto(url);
//                 await page.waitForLoadState('load');
//                 await page.waitForTimeout(10000);
//                 const HustleArray = await page.evaluate(async () => {
//                     delay = ms => new Promise(res => setTimeout(res, ms));
//                     var hustleObj: any = {}
//                     //@ts-ignore
//                     console.log('hustleObj', hustleObj)
//                     const imgText = document.getElementsByClassName('notion-header__icon-wrapper has-cover has-icon')[0].childNodes[0].textContent || ''
//                     console.log('imgText', imgText);
//                     const hustleTitle = document.getElementsByClassName('notion-header__title')[0].textContent
//                     console.log('hustleTitle', hustleTitle);
//                     //@ts-ignore
//                     const imgSrc = document.getElementsByClassName('notion-header__cover-image')[0].currentSrc
//                     console.log('imgSrc', imgSrc);
//                     const workType = []
//                     const workTypeAll = document.getElementsByClassName('notion-property notion-property__select property-undefined')
//                     //@ts-ignore
//                     const workTypeChild = workTypeAll[0].childNodes
//                     for (let j = 0; j < workTypeChild.length; j++) {
//                         const text = workTypeChild[j]
//                         console.log('textAll', text);
//                         workType.push(workTypeChild[j].textContent || '')
//                     }
//                     console.log('workType', workType)
//                     const jobType = document.getElementsByClassName('notion-property notion-property__select property-undefined')[1]?.textContent || ''
//                     console.log('jobType', jobType)
//                     const workTypeFullText = document.getElementsByClassName('notion-text')[0]?.textContent || ''
//                     console.log('workTypeFullText', workTypeFullText)
//                     const companyDemoIcon = document.getElementsByClassName('notion-callout bg-orange-light border')[0]?.childNodes[0]?.textContent || ''
//                     console.log('companyDemoIcon', companyDemoIcon)
//                     const element = [...document.querySelectorAll('span')]
//                         .find(el => el.textContent.toLowerCase().includes('description'));
//                     const f = element.parentElement
//                     const g = f.parentElement
//                     const gChild = g.childNodes
//                     const companyDemoDesc = []
//                     for (i = 1; i < gChild.length; i++) {
//                         companyDemoDesc.push(gChild[i].textContent)
//                     }
//                     console.log('companyDemoDesc', companyDemoDesc)
//                     const elem = [...document.querySelectorAll('span')]
//                         .find(el => el.textContent.toLowerCase().includes('sign up'));
//                     const gTag = elem.getElementsByTagName('a')
//                     const signUpurl = gTag[0]?.href || ''
//                     console.log('signUpurl', signUpurl)
//                     const equipmentAll = []
//                     const equip = [...document.querySelectorAll('span')]
//                         .find(el => el.textContent.toLowerCase().includes('equipment needed'));
//                     const equipP = equip.parentElement
//                     const equipParent = equipP.parentElement.childNodes
//                     // const requirementChild = requirementAll[0].childNodes
//                     for (let k = 1; k < equipParent.length; k++) {
//                         equipmentAll.push(equipParent[k]?.textContent || '')
//                     }
//                     console.log('equipmentAll', equipmentAll)

//                     const averagePay = []
//                     const average = [...document.querySelectorAll('span')]
//                         .find(el => el.textContent.toLowerCase().includes('average pay'));
//                     const averageP = average.parentElement
//                     const averageParent = averageP.parentElement.childNodes

//                     for (let k = 1; k < averageParent.length; k++) {
//                         averagePay.push(averageParent[k]?.textContent || '')
//                     }

//                     console.log('averagePay', averagePay)

//                     const makingMoney = []
//                     const makingM = [...document.querySelectorAll('span')]
//                         .find(el => el.textContent.toLowerCase().includes('people making money on platform'));
//                     const makingMP = makingM.parentElement
//                     const makingMPParent = makingMP.parentElement.childNodes
//                     for (let k = 1; k < makingMPParent.length; k++) {
//                         makingMoney.push(makingMPParent[k]?.textContent || '')
//                     }


//                     console.log('makingMoney', makingMoney)

//                     const platformPricing = []
//                     const platformPricingp = [...document.querySelectorAll('span')]
//                         .find(el => el.textContent.toLowerCase().includes('platform pricing'));
//                     const platformPricingP = platformPricingp.parentElement
//                     const platformPricingPParent = platformPricingP.parentElement.childNodes

//                     for (let k = 1; k < platformPricingPParent.length; k++) {
//                         platformPricing.push(platformPricingPParent[k]?.textContent || '')
//                     }

//                     console.log('platformPricing', platformPricing)


//                     const audience = []
//                     const audiencep = [...document.querySelectorAll('span')]
//                         .find(el => el.textContent.toLowerCase().includes('requires audience'));
//                     const audienceP = audiencep.parentElement
//                     const audiencePParent = audienceP.parentElement.childNodes

//                     for (let k = 1; k < audiencePParent.length; k++) {
//                         audience.push(audiencePParent[k]?.textContent || '')
//                     }

//                     console.log('audience', audience)


//                     const founded = []
//                     const foundedp = [...document.querySelectorAll('span')]
//                         .find(el => el.textContent.toLowerCase().includes('founded'));
//                     const foundedpP = foundedp.parentElement
//                     const foundedpParent = foundedpP.parentElement.childNodes

//                     for (let k = 1; k < foundedpParent.length; k++) {
//                         founded.push(foundedpParent[k]?.textContent || '')
//                     }

//                     console.log('founded', founded)

//                     const foundingp = [...document.querySelectorAll('span')]
//                         .find(el => el?.textContent.toLowerCase().includes('funding'));
//                     const foundingP = foundingp.parentElement
//                     // const foundigPSib = foundingP.nextSibling
//                     const founding = foundingP?.nextSibling.textContent || ''

//                     console.log('founding', founding)


//                     hustleObj.imgText = imgText
//                     hustleObj.hustleTitle = hustleTitle

//                     hustleObj.imgSrc = imgSrc


//                     hustleObj.workType = workType
//                     hustleObj.jobType = jobType
//                     hustleObj.workTypeFullText = workTypeFullText
//                     hustleObj.companyDemoIcon = companyDemoIcon
//                     hustleObj.companyDemoDesc = companyDemoDesc
//                     hustleObj.signUpurl = signUpurl
//                     hustleObj.equipmentAll = equipmentAll
//                     hustleObj.averagePay = averagePay
//                     hustleObj.makingMoney = makingMoney
//                     hustleObj.platformPricing = platformPricing
//                     hustleObj.audience = audience
//                     hustleObj.founded = founded
//                     hustleObj.founding = founding
//                     console.log('hustleObj', hustleObj)
//                     await delay(3000)
//                     return hustleObj

//                 })
//                 HustleScrapDataArray.push(HustleArray)

//             }
//             fs.writeFileSync('metaTags.json', JSON.stringify(HustleScrapDataArray, null, 2));

//         }

//         catch (error) {
//             console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)
//             fs.writeFileSync('metaTags.json', JSON.stringify(HustleScrapDataArray, null, 2));
//         }
//     })
// }

