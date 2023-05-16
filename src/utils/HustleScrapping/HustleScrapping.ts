import { chromium } from "playwright";
const { spawnSync } = require("child_process");

const fs = require('fs');
let delay = ms => new Promise(res => setTimeout(res, ms));
const timeout = 1000 * 60 * 10;
var HustleScrapDataArray: any = [];

export const hustleScrapping = async (): Promise<any> => {
    spawnSync("npx", ["playwright", "install", "chromium"]);
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log("Started Scrap");
            const browser = await chromium.launch({ headless: false, timeout: timeout });
            const context = await browser.newContext();

            context.setDefaultNavigationTimeout(timeout)
            context.setDefaultTimeout(timeout)


            const page = await context.newPage();
            await page.goto('http://web.archive.org/web/20221212190828/https://sidehustlestack.co/');
            await page.waitForTimeout(5000);
            // await page.goto("https://codelist.cc/en/")
            // await page.waitForTimeout(2000);

            const allHuss = await page.evaluate(async () => {
                // const h = document.getElementsByClassName('notion-collection-gallery medium')
                // const c = h[1].getElementsByTagName('a')
                // console.log('c', c)
                // return c
                const h = document.getElementsByClassName('notion-collection-gallery medium');
                const hrefs = [];

                // for (let i = 0; i < h.length; i++) {
                const aTags = h[1].getElementsByTagName('a');
                for (let j = 0; j < aTags.length; j++) {
                    hrefs.push(aTags[j].href);
                }
                // }

                return hrefs;
            })

            const allHustles = allHuss
            console.log('allHustles', allHustles)

            // for (let i = 0; i < allHustles.length; i++) {
            for (let i = 217; i < 230; i++) {
                const u = 'http://web.archive.org/web/20221212190828/';
                const z = allHustles[i];
                // let y = await z.getAttribute('href')
                // let x = y.split('https://')
                const url = u.concat(z);
                // console.log('url', url);
                // console.log('url1', u);
                console.log('url2', z);
                // console.log('url3', y);
                console.log('url', url);

                await page.goto(url);
                await page.waitForLoadState('load');
                await page.waitForTimeout(10000);
                const HustleArray = await page.evaluate(async () => {
                    // var HustleScrapDataArray: any = [];
                    delay = ms => new Promise(res => setTimeout(res, ms));
                    // const catItem = document.getElementsByClassName('grid-item filter')
                    // for (var item = 0; item < catItem.length; item++) {
                    //     // for (var item = 0; item < 1; item++) {
                    //     //@ts-ignore
                    //     await catItem[item].click();
                    //     await delay(5000)



                    // const allHustles = document.getElementsByClassName('notion-collection-card gallery');
                    // console.log('allHustles', allHustles)
                    // for (let i = 0; i < allHustles.length; i++) {
                    // for (let i = 0; i < 2; i++) {
                    //     const u = 'http://web.archive.org/web/20221119030344/https://'
                    //     const z = allHustles[i].getElementsByTagName('a')[0].href
                    //     const url = u.concat(z)
                    //     console.log('url', url)
                    //     //@ts-ignore
                    //     page.goto(url)
                    // for (let i = 0; i < 2; i++) {
                    var hustleObj: any = {}
                    //@ts-ignore
                    // await allHustles[i].click()
                    // await delay(10000)
                    console.log('hustleObj', hustleObj)

                    const imgText = document.getElementsByClassName('notion-header__icon-wrapper has-cover has-icon')[0].childNodes[0].textContent || ''
                    console.log('imgText', imgText);

                    const hustleTitle = document.getElementsByClassName('notion-header__title')[0].textContent
                    console.log('hustleTitle', hustleTitle);
                    //@ts-ignore
                    const imgSrc = document.getElementsByClassName('notion-header__cover-image')[0].currentSrc
                    console.log('imgSrc', imgSrc);

                    const workType = []
                    const workTypeAll = document.getElementsByClassName('notion-property notion-property__select property-undefined')
                    //@ts-ignore
                    const workTypeChild = workTypeAll[0].childNodes
                    for (let j = 0; j < workTypeChild.length; j++) {
                        const text = workTypeChild[j]
                        console.log('textAll', text);
                        workType.push(workTypeChild[j].textContent || '')
                    }
                    console.log('workType', workType)

                    const jobType = document.getElementsByClassName('notion-property notion-property__select property-undefined')[1]?.textContent || ''
                    console.log('jobType', jobType)

                    const workTypeFullText = document.getElementsByClassName('notion-text')[0]?.textContent || ''
                    console.log('workTypeFullText', workTypeFullText)

                    const companyDemoIcon = document.getElementsByClassName('notion-callout bg-orange-light border')[0]?.childNodes[0]?.textContent || ''
                    console.log('companyDemoIcon', companyDemoIcon)

                    const element = [...document.querySelectorAll('span')]
                        .find(el => el.textContent.toLowerCase().includes('description'));
                    const f = element.parentElement
                    const g = f.parentElement
                    const gChild = g.childNodes
                    const companyDemoDesc = []
                    for (i = 1; i < gChild.length; i++) {
                        companyDemoDesc.push(gChild[i].textContent)
                    }
                    // const companyDemoDesc = document.getElementsByClassName('notion-callout bg-orange-light border')[0].childNodes[1].textContent || ''
                    console.log('companyDemoDesc', companyDemoDesc)

                    const elem = [...document.querySelectorAll('span')]
                        .find(el => el.textContent.toLowerCase().includes('sign up'));

                    const gTag = elem.getElementsByTagName('a')
                    const signUpurl = gTag[0]?.href || ''
                    // const signUpurl = document.getElementsByClassName('notion-callout bg-orange-light border')[0].childNodes[1].textContent || ''
                    console.log('signUpurl', signUpurl)


                    const equipmentAll = []
                    const equip = [...document.querySelectorAll('span')]
                        .find(el => el.textContent.toLowerCase().includes('equipment needed'));
                    const equipP = equip.parentElement
                    const equipParent = equipP.parentElement.childNodes
                    // const requirementChild = requirementAll[0].childNodes
                    for (let k = 1; k < equipParent.length; k++) {
                        equipmentAll.push(equipParent[k]?.textContent || '')
                    }
                    console.log('equipmentAll', equipmentAll)

                    const averagePay = []
                    const average = [...document.querySelectorAll('span')]
                        .find(el => el.textContent.toLowerCase().includes('average pay'));
                    const averageP = average.parentElement
                    const averageParent = averageP.parentElement.childNodes
                    // const requirementChild = requirementAll[0].childNodes
                    for (let k = 1; k < averageParent.length; k++) {
                        averagePay.push(averageParent[k]?.textContent || '')
                    }

                    // const averagePay = document.getElementsByClassName('notion-semantic-string')[13].textContent || ''
                    console.log('averagePay', averagePay)

                    const makingMoney = []
                    const makingM = [...document.querySelectorAll('span')]
                        .find(el => el.textContent.toLowerCase().includes('people making money on platform'));
                    const makingMP = makingM.parentElement
                    const makingMPParent = makingMP.parentElement.childNodes
                    // const requirementChild = requirementAll[0].childNodes
                    for (let k = 1; k < makingMPParent.length; k++) {
                        makingMoney.push(makingMPParent[k]?.textContent || '')
                    }

                    // const makingMoney = document.getElementsByClassName('notion-semantic-string')[15].textContent || ''
                    console.log('makingMoney', makingMoney)

                    const platformPricing = []
                    const platformPricingp = [...document.querySelectorAll('span')]
                        .find(el => el.textContent.toLowerCase().includes('platform pricing'));
                    const platformPricingP = platformPricingp.parentElement
                    const platformPricingPParent = platformPricingP.parentElement.childNodes
                    // const requirementChild = requirementAll[0].childNodes
                    for (let k = 1; k < platformPricingPParent.length; k++) {
                        platformPricing.push(platformPricingPParent[k]?.textContent || '')
                    }
                    // console.log('equipmentAll', equipmentAll)

                    // const platformPricing = document.getElementsByClassName('notion-semantic-string')[17].textContent || ''
                    console.log('platformPricing', platformPricing)


                    const audience = []
                    const audiencep = [...document.querySelectorAll('span')]
                        .find(el => el.textContent.toLowerCase().includes('requires audience'));
                    const audienceP = audiencep.parentElement
                    const audiencePParent = audienceP.parentElement.childNodes
                    // const requirementChild = requirementAll[0].childNodes
                    for (let k = 1; k < audiencePParent.length; k++) {
                        audience.push(audiencePParent[k]?.textContent || '')
                    }
                    // const audience = document.getElementsByClassName('notion-semantic-string')[19].textContent || ''
                    console.log('audience', audience)


                    const founded = []
                    const foundedp = [...document.querySelectorAll('span')]
                        .find(el => el.textContent.toLowerCase().includes('founded'));
                    const foundedpP = foundedp.parentElement
                    const foundedpParent = foundedpP.parentElement.childNodes
                    // const requirementChild = requirementAll[0].childNodes
                    for (let k = 1; k < foundedpParent.length; k++) {
                        founded.push(foundedpParent[k]?.textContent || '')
                    }
                    // const founded = document.getElementsByClassName('notion-semantic-string')[21].textContent || ''
                    console.log('founded', founded)


                    // const founding = []
                    const foundingp = [...document.querySelectorAll('span')]
                        .find(el => el?.textContent.toLowerCase().includes('funding'));
                    const foundingP = foundingp.parentElement
                    // const foundigPSib = foundingP.nextSibling
                    const founding = foundingP?.nextSibling.textContent || ''
                    // for (let k = 1; k < foundigPSib.length; k++) {
                    //     founding.push(foundigPSib[k]?.textContent || '')
                    // }
                    // const founding = document.getElementsByClassName('notion-semantic-string')[23].textContent || ''
                    console.log('founding', founding)
                    //@ts-ignore
                    // await clickT[0].click()

                    hustleObj.imgText = imgText
                    hustleObj.hustleTitle = hustleTitle
                    // const urlE = 'https://web.archive.org/web/20230101212800im_/https://sidehustlestack.co'
                    // if (imgSrc.includes('/_next/image?url')) {
                    // hustleObj.imgSrc = urlE.concat(imgSrc)
                    // }
                    // else {
                    hustleObj.imgSrc = imgSrc
                    // }

                    hustleObj.workType = workType
                    hustleObj.jobType = jobType
                    hustleObj.workTypeFullText = workTypeFullText
                    hustleObj.companyDemoIcon = companyDemoIcon
                    hustleObj.companyDemoDesc = companyDemoDesc
                    hustleObj.signUpurl = signUpurl
                    hustleObj.equipmentAll = equipmentAll
                    hustleObj.averagePay = averagePay
                    hustleObj.makingMoney = makingMoney
                    hustleObj.platformPricing = platformPricing
                    hustleObj.audience = audience
                    hustleObj.founded = founded
                    hustleObj.founding = founding
                    // hustleObj.category = catItem[item].textContent
                    console.log('hustleObj', hustleObj)
                    // HustleScrapDataArray.push(hustleObj)
                    await delay(3000)
                    return hustleObj

                    // await delay(3000)
                })
                // }
                HustleScrapDataArray.push(HustleArray)
                // return HustleScrapDataArray
                // })
                // console.log('HustleScrapDataArray', HustleScrapDataArray)
                // return HustleScrapDataArray

                // console.log('HustleArray', HustleArray);
                // resolve(HustleArray)
            }
            fs.writeFileSync('metaTags.json', JSON.stringify(HustleScrapDataArray, null, 2));
            // resolve(HustleScrapDataArray)
        }
        // const catHustles = await page.$('div.chakra-card__body.css-1idwstw');




        // Perform additional actions on the DOM here


        // const result = { totalP, page, context }
        // resolve(result);

        catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)
            fs.writeFileSync('metaTags.json', JSON.stringify(HustleScrapDataArray, null, 2));
            // resolve(HustleScrapDataArray)
        }
    })
}

// //Hustle new
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
//             await page.goto('https://sidehustlestack.co');
//             await page.waitForTimeout(3000);
//             // await page.goto("https://codelist.cc/en/")
//             // await page.waitForTimeout(2000);
//             const HustleArray = await page.evaluate(async () => {
//                 var HustleScrapDataArray: any = [];
//                 delay = ms => new Promise(res => setTimeout(res, ms));
//                 const catItem = document.getElementsByClassName('grid-item filter')
//                 for (var item = 0; item < catItem.length; item++) {
//                     // for (var item = 0; item < 1; item++) {
//                     //@ts-ignore
//                     await catItem[item].click();
//                     await delay(5000)



//                     const catHustles = document.getElementsByClassName('chakra-card__body css-1idwstw');
//                     console.log('catHustles', catHustles)
//                     for (let i = 0; i < catHustles.length; i++) {
//                         // for (let i = 0; i < 2; i++) {
//                         var hustleObj: any = {}
//                         //@ts-ignore
//                         await catHustles[i].click()
//                         await delay(5000)

//                         const imghref = document.getElementsByClassName('info-container')[0].getElementsByTagName('a')[0].href
//                         console.log('imghref', imghref);
//                         //@ts-ignore
//                         const imgSrc = document.getElementsByClassName('info-container')[0].getElementsByTagName('img')[0].src
//                         console.log('imgSrc', imgSrc);
//                         const tags = []
//                         const tagAll = document.getElementsByClassName('info-container')[1]
//                         //@ts-ignore
//                         const tagAllChild = tagAll.childNodes
//                         for (let j = 0; j < tagAllChild.length; j++) {
//                             tags.push(tagAllChild[j].textContent)
//                         }
//                         console.log('tags', tags)

//                         const applyHref = document.getElementsByClassName('info-container')[2].getElementsByTagName('a')[0].href
//                         console.log('applyHref', applyHref)
//                         const description = document.getElementsByClassName('info-container')[3].getElementsByTagName('p')[0].textContent
//                         console.log('description', description)
//                         const founded = document.getElementsByClassName('info-container')[4].getElementsByTagName('p')[0].textContent
//                         console.log('founded', founded)

//                         const requirement = []
//                         const requirementAll = document.getElementsByClassName('css-tu0njr')
//                         const requirementChild = requirementAll[0].childNodes
//                         for (let k = 0; k < requirementChild.length; k++) {
//                             requirement.push(requirementChild[k].textContent)
//                         }
//                         console.log('requirement', requirement)

//                         const pricing = document.getElementsByClassName('info-container')[6].childNodes[1].textContent
//                         console.log('pricing', pricing)

//                         const clickT = document.getElementsByClassName('chakra-modal__close-btn css-1ik4h6n')
//                         console.log('clickT', clickT)
//                         //@ts-ignore
//                         await clickT[0].click()

//                         hustleObj.imghref = imghref
//                         hustleObj.imgSrc = imgSrc
//                         hustleObj.tags = tags
//                         hustleObj.applyHref = applyHref
//                         hustleObj.description = description
//                         hustleObj.founded = founded
//                         hustleObj.requirement = requirement
//                         hustleObj.pricing = pricing
//                         hustleObj.category = catItem[item].textContent
//                         console.log('hustleObj', hustleObj)
//                         HustleScrapDataArray.push(hustleObj)
//                         await delay(3000)

//                         // await delay(3000)
//                     }
//                 }
//                 console.log('HustleScrapDataArray', HustleScrapDataArray)
//                 return HustleScrapDataArray
//             })
//             console.log('HustleArray', HustleArray);
//             resolve(HustleArray)
//         }
//         // const catHustles = await page.$('div.chakra-card__body.css-1idwstw');




//         // Perform additional actions on the DOM here


//         // const result = { totalP, page, context }
//         // resolve(result);

//         catch (error) {
//             console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

//             reject(error);
//         }
//     })

// }