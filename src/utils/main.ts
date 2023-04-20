import { chromium } from "playwright";

// const fs = require('fs');
// const Fjsondb = require('fjsondb');
// const db = new Fjsondb('/path/to/your/storage.json');


const metaTags:any = [];

// require('console-stamp')(console, '[HH:MM:ss.l]');
export const main =() => {
    return new Promise(async (resolve, reject) => {
      try {
        //get browser instance
        const browser = await chromium.launch({ headless: false });
  console.log('lllll');
        // Create a new browser context
        const context = await browser.newContext();

        // Create a new page
        const page = await context.newPage();
        // const page = await browser.newPage();
 
        for (var i = 1; i < 2; i++) {
        
          await page.goto(`https://www.revdl.com/page/${i}/`);
          const allReadMoreHref = await page.evaluate(() => {
            const metaTags = [];
            const metaTagElements = document.querySelectorAll('.tpcrn-read-more');
            console.log('metaTagElements', metaTagElements);
            metaTagElements.forEach(metaTagElement => {
              const href = metaTagElement.getAttribute('href') || '';
              console.log('href', href)
              metaTags.push(href);
            });
            return metaTags;
          });

          // for (var j = 0; j < allReadMoreHref.length; j++) {
            for (var j = 0; j < 1; j++) {
            var apkObj: any = {}
        

            await page.goto(allReadMoreHref[j])
  
            const title = await page.locator('.post-title h1').innerText() || ''
            const imgSrc = await page.locator('.attachment-featured_image').getAttribute('data-src') || ''
            const createdAt = await page.locator('.post-date').innerText() || ''

            const categoriesInnerText = await page.$eval('.entry_categories', (element) => {
              const anchors = Array.from(element.querySelectorAll('a'));
              const innerTextArray = anchors.map((anchor) => anchor.innerText || '');
              const concatenatedText = innerTextArray.join(',');
              console.log('concatenatedText', concatenatedText)
              return concatenatedText;
            });
        
            const fileVersionsSizeDeveloper = await page.$$eval('.dl-size', (elements) => {
              return elements.map(element => {
                const secondSpan = element.querySelector('span:nth-child(2)');
                return secondSpan ? secondSpan.textContent.trim() : '';
              });
            });
      
            const version = fileVersionsSizeDeveloper[0] ||'';
            const fileSize = fileVersionsSizeDeveloper[1] ||'';
            const developer = fileVersionsSizeDeveloper[2] ||'';

            const parentInnerText = await page.$eval('.post_content.entry-content', (element) => {
              const children = Array.from(element.children);
              const filteredChildren = children.filter((child) => !child.classList.contains('wp-caption') && !child.classList.contains('hatom-extra'));
              const innerTextArray = filteredChildren.flatMap((child) => child.textContent.trim().split('\n')) || '';
              // Join the innerText values with commas
              // return innerTextArray.join(',');
              return innerTextArray;
            });
      
            console.log('innerTexts', parentInnerText); // Output the innerTexts to the console

            const imgSrcAll = await page.evaluate(() => {
              var imgs = document.getElementsByClassName('post_content')[0].getElementsByTagName('img')
              var srcs = [];
              for (var i = 0; i < imgs.length; i++) {
                srcs.push(imgs[i].getAttribute('data-src'));
              }               
              return srcs
            }
            )
            console.log('imgSrcAll', imgSrcAll);
            
            const downloadButtons = await page.$$('.download_button');
            // Click on the first download button
            if (downloadButtons.length > 0) {
              await downloadButtons[0].click();
              // Wait for navigation to complete with an increased timeout value of 30 seconds
              await page.waitForTimeout(10000); // Add a delay to allow time for new tab to open
    
              // Get the newly opened page
              const pages = await context.pages();
              const newPage = pages[pages.length - 1];
      
              const newPageExtractedMetaTags = await newPage.evaluate(() => {
                const metaTagsArr: any = [];
                const metaTagElements = document.querySelectorAll('.dl a');
                metaTagElements.forEach(metaTagElement => {
                  const metaTag: any = {};
                  metaTag.href = metaTagElement.getAttribute('href') || '';
                  metaTag.innerText = metaTagElement.textContent.trim() || '';
                  metaTagsArr.push(metaTag);
                });
                return metaTagsArr;
              });
              apkObj.title = title
              apkObj.imgSrc = imgSrc
              apkObj.createdAt = createdAt
              apkObj.categories = categoriesInnerText
              apkObj.version = version
              apkObj.fileSize = fileSize
              apkObj.developer = developer
              apkObj.allText = parentInnerText
              apkObj.imgSrcAll =imgSrcAll
              apkObj.downloadFile = newPageExtractedMetaTags
              metaTags.push(apkObj)
            }
            // page.waitForTimeout(20000)
          }
        }
        resolve(metaTags)
      }
  
      catch (error) {
        reject('error')
        console.log('eeee', error)
      }
      
    })
  }



