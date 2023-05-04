import { chromium } from "playwright";
import { ApksService } from "src/apks/apks.service";
const { spawnSync } = require("child_process");
const apkScrapDataArray: any = [];
var catSubcat: any = [];
export const apkScrapping = (lastDate) => {
  spawnSync("npx", ["playwright", "install", "chromium"]);
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await chromium.launch({ headless: false, timeout:1000*60*30 });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto('https://www.revdl.com');
      await page.waitForTimeout(5000);
      let totalP = await page.evaluate(() => {
        const dotsSpan = document.querySelector('.page-numbers.dots');
        const nextDivText = dotsSpan.nextElementSibling.textContent;
        console.log('nextDivText',nextDivText)
        return parseInt(nextDivText.replace(',',''))
      })
 
    console.log('page', totalP)
     //from back
      for (var i = totalP; i >= 1; i--) {
      //// for (var i = 1; i < 4; i++) {
      // //from front
      // for (var i = 1;i<=totalP ; i++) {
        console.log('iindex', i)
        await page.goto(`https://www.revdl.com/page/${i}/`);

        const NextStep = await page.evaluate(() => {

          const elements = document.getElementsByClassName("post-date date updated");
          console.log('elements',elements)
          const texts = [];
          for (let i = 0; i < elements.length; i++) {
            texts.push(elements[i].textContent);
          }
          console.log(texts);
          return texts
        })
      console.log('nextstep', NextStep)
      // //from front
      //   for (let k = 0; k < NextStep.length; k++) {
      //     console.log(NextStep[k]);
      //     if (new Date(lastDate) > new Date(NextStep[k])) {
      //       console.log('true', new Date(lastDate) > new Date(NextStep[k]))
      //       totalP=i
      //       break
      //     }
      //   }
      console.log('lastDate',lastDate);
     // from back
      const pageChange = () => {
        let text=[]
        for (let k = 0; k < NextStep.length; k++) {
          console.log(NextStep[k]);  
          if (new Date(lastDate) > new Date(NextStep[k] || null)) {
          //   console.log('true', new Date(lastDate) > new Date(NextStep[k]))
          text.push(true)
          }
          else {
            text.push(false)
          }
        }
        return text
      }

      console.log('pageChange()',pageChange())
      if (pageChange().filter(value => value === true).length===NextStep.length) {
        console.log()
        continue
      }

        const allReadMoreHref = await page.evaluate(() => {
          const readMoreArray = [];
          const readMoreElements = document.querySelectorAll('.tpcrn-read-more');
          console.log('metaTagElements', readMoreElements);
          readMoreElements.forEach(readMoreElement => {
            const href = readMoreElement.getAttribute('href') || '';
            readMoreArray.push(href);
          });
          return readMoreArray;
        });
        if (allReadMoreHref.length === 0) {
          console.log('break')
          break;
        }
        for (var j = 0; j < allReadMoreHref.length; j++) {
          // for (var j = 0; j < 1; j++) {
          var apkObj: any = {}
          await page.goto(allReadMoreHref[j])
          await page.waitForLoadState('load');
          await page.waitForTimeout(2000);

          

          const created = await page.locator('.post-date').innerText() || ''
          const createdN = await page.locator('.post-date').innerText() || null
          console.log('created',createdN)
          const dateC = new Date(createdN?createdN:null);
          const dateL= new Date(lastDate)
          if (dateL > dateC) {
            console.log('hee')
            continue
          }
          const createdDate = dateC.toISOString();
          const categoriesInnerText = await page.$eval('.entry_categories', (element) => {
            const anchors = Array.from(element.querySelectorAll('a'));
            const innerTextArray = anchors.map((anchor) => anchor.innerText || '');
            const concatenatedText = innerTextArray.join(',');
            console.log('concatenatedText', concatenatedText)
            return concatenatedText;
          });

          const title = await page.locator('.post-title h1').innerText() || ''
          const imgSrc = await page.locator('.attachment-featured_image').getAttribute('data-src') || ''

          const fileVersionsSizeDeveloper = await page.$$eval('.dl-size', (elements) => {
            return elements.map(element => {
              const secondSpan = element.querySelector('span:nth-child(2)');
              return secondSpan ? secondSpan.textContent.trim() : '';
            });
          });
          const version = fileVersionsSizeDeveloper[0] || '';
          const fileSize = fileVersionsSizeDeveloper[1] || '';
          const developer = fileVersionsSizeDeveloper[2] || '';

          const allInnerDescription = await page.$eval('.post_content.entry-content', (element) => {
            const children = Array.from(element.children);
            const filteredChildren = children.filter((child) => !child.classList.contains('wp-caption') && !child.classList.contains('hatom-extra'));
            const innerTextArray = filteredChildren.flatMap((child) => child.textContent.trim().split('\n')) || '';
            // return innerTextArray.join(',');
            return innerTextArray;
          });
          console.log('innerTexts', allInnerDescription); // Output the innerTexts to the console
          const imgSrcAll = await page.evaluate(() => {
            var imgs = document.getElementsByClassName('post_content')[0].getElementsByTagName('img')
            var srcs = [];
            for (var i = 0; i < imgs.length; i++) {
              srcs.push(imgs[i].getAttribute('data-src') || '');
            }
            return srcs
          }
          )
          console.log('imgSrcAll', imgSrcAll);

          const downloadButtons = await page.$$('.download_button');
          if (downloadButtons.length > 0) {
            await downloadButtons[0].click();
            // await page.waitForTimeout(10000); // Add a delay to allow time for new tab to open
            // Get the newly opened page
            const pages = await context.pages();
            const newPage = pages[pages.length - 1];
            await newPage.waitForLoadState('load');
            await newPage.waitForTimeout(5000)

            const requiredAndroid = await newPage.evaluate(() => {
              var androidVersions = document?.getElementsByClassName('dl-version')[0]?.getElementsByTagName('span')[1]?.innerText || ''
              return androidVersions
            })
            const newPageExtractedMetaTags = await newPage.evaluate(() => {
              const downloadLinkDetailArr: any = [];
              const downloadLinkDetail = document.querySelectorAll('.dl a');
              downloadLinkDetail.forEach(downloadLink => {
                const downloadLinkObj: any = {};
                downloadLinkObj.href = downloadLink.getAttribute('href') || '';
                downloadLinkObj.innerText = downloadLink.textContent.trim() || '';
                downloadLinkDetailArr.push(downloadLinkObj);
              });
              return downloadLinkDetailArr;
            });
            apkObj.title = title
            apkObj.imgSrc = imgSrc
            apkObj.created = created
            apkObj.createdDate =createdDate
            apkObj.categories = categoriesInnerText
            apkObj.version = version
            apkObj.fileSize = fileSize
            apkObj.developer = developer
            apkObj.allText = allInnerDescription
            apkObj.imgSrcAll = imgSrcAll
            apkObj.requiredAndroid = requiredAndroid
            apkObj.downloadFile = newPageExtractedMetaTags
            console.log('apkObjLast',apkObj)
            apkScrapDataArray.push(apkObj)
          }
          // page.waitForTimeout(20000)
        }
      }
      // const objj:any= {}
      // objj.catSub = catSubcat
      // console.log('objj',objj)
      // apkScrapDataArray.push(objj)
      // console.log('apkScrapDataArray',apkScrapDataArray)
      resolve(apkScrapDataArray)
      // browser.close()
    }
    catch (error) {
      resolve(apkScrapDataArray)
      console.log('eeee', error)

    }
  })
}



