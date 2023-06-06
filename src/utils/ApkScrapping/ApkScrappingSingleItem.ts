
// const apkScrapDataArray: any = [];
export const apkScrappingSingleItem = async (page: any, lastDate: any, allReadMoreHref: any, j: any, context: any): Promise<any> => {
  return new Promise<any>(async (resolve, reject) => {
    try {

      // for (var j = 0; j < 1; j++) {
      var apkObj: any = {}
      await page.goto(allReadMoreHref[j])
      await page.waitForLoadState('load');
      await page.waitForTimeout(2000);



      const created = await page.locator('.post-date').innerText() || ''
      const createdN = await page.locator('.post-date').innerText() || null
      console.log('created', createdN)
      const dateC = new Date(createdN ? createdN : null);
      const dateL = new Date(lastDate)
      if (dateL > dateC) {
        console.log('hee')
        resolve("continue")
        return
      }
      const createdDate = dateC.toISOString();
      const categoriesInnerText = await page.$eval('.entry_categories', (element: Element) => {
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

      const allInnerDescription = await page.$eval('.post_content.entry-content', (element: Element) => {
        // const children = Array.from(element.children);
        // const filteredChildren = children.filter((child) => !child.classList.contains('wp-caption') && !child.classList.contains('hatom-extra'));
        // const innerTextArray = filteredChildren.flatMap((child) => child.textContent.trim().split('\n')) || '';
        // // return innerTextArray.join(',');
        // return innerTextArray;
        // Get the element with class "post_content"
        var postContent = document.querySelector('.post_content');

        // Initialize an empty array to store the extracted text
        var textArray = [];

        // Recursive function to traverse through the DOM tree and extract text nodes
        function extractTextNodes(element) {
          for (var i = 0; i < element.childNodes.length; i++) {
            var node = element.childNodes[i];

            // Check if the node is a text node and not under the 'hatom-extra' class
            if (node.nodeType === Node.TEXT_NODE && !node.parentElement.classList.contains('hatom-extra')) {
              // Extract the text content
              var text = node.textContent.trim();

              // Check if the text includes '<img'
              if (text.indexOf('<img') === -1) {
                // Add the text to the array
                textArray.push(text);
              }
            } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'IMG') {
              // Recursively call the function for non-img element nodes
              extractTextNodes(node);
            }
          }
        }

        // Call the recursive function to extract text nodes
        extractTextNodes(postContent);

        // Output the resulting text array
        console.log(textArray);
        return textArray

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
        await page.waitForTimeout(10000); // Add a delay to allow time for new tab to open
        // Get the newly opened page


        //early start
        async function myFunction() {
          const pages = await context.pages();
          const newPage = pages[pages.length - 1];
          await newPage.waitForLoadState('load');
          // await newPage.waitForTimeout(5000)

          const requiredAndroid = await newPage.evaluate(() => {
            var androidVersions = document?.getElementsByClassName('dl-version')[0]?.getElementsByTagName('span')[1]?.innerText || ''
            return androidVersions
          });
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

          // Do something with requiredAndroid and newPageExtractedMetaTags
          return { newPageExtractedMetaTags, requiredAndroid }
        }
        //early end

        const { newPageExtractedMetaTags, requiredAndroid } = await myFunction()

        apkObj.title = title
        apkObj.imgSrc = imgSrc
        apkObj.created = created
        apkObj.createdDate = createdDate
        apkObj.categories = categoriesInnerText
        apkObj.version = version
        apkObj.fileSize = fileSize
        apkObj.developer = developer
        apkObj.allText = allInnerDescription
        apkObj.imgSrcAll = imgSrcAll
        apkObj.requiredAndroid = requiredAndroid
        apkObj.downloadFile = newPageExtractedMetaTags
        console.log('apkObjLast', apkObj)

        // apkScrapDataArray.push(apkObj)
      }

      resolve(apkObj)

      // console.log('going to details page item', k + 1);
      // const codeObj: any = {}
      // await page.waitForTimeout(10000)
      // await page.goto(codeDatas[k].url)
      // await page.waitForTimeout(2000)
      // const title = codeDatas[k].title;
      // const description = codeDatas[k].description;
      // const img = codeDatas[k].imgSrc;
      // let category = codeDatas[k].category;
      // if (category.includes("/")) {
      //     const parts = category.split("/");
      //     category = parts[1]
      // }
      // const date = codeDatas[k].date;
      // const nullorTextDate = date || null;
      // const dateC = new Date(nullorTextDate);
      // const dateL = new Date(lastDate)
      // if (dateL > dateC) {
      //     resolve("continue")
      //     return;
      // }
      // const mongoDbDate = dateC.toISOString();
      // const downloadLinks = await page.evaluate(() => {
      //     //@ts-ignore
      //     const downloadLinksArr = document.getElementsByClassName('quote')[0].innerText.split("\n")
      //     return downloadLinksArr.filter((item) => item !== "");
      // })

      // //codecanyon scrap
      // const linkText = await page.evaluate(() => {
      //     const link = document.querySelector('.single-body a');
      //     return link.textContent;
      // });
      // await page.waitForTimeout(10000);
      // if (linkText.includes("codecanyon")) {
      //     console.log("going to codecanyon");
      //     await page.goto(linkText);
      //     await page.waitForTimeout(2000);

      //     const htmlContent = await page.evaluate(() => {
      //         const element = document.querySelector('.user-html'); // replace "your-class" with your class name
      //         if (!element) {
      //             return null; // Return null if the element is not found 
      //         }
      //         let htmlContent = element.innerHTML;

      //         // Replace newline characters with <br/>
      //         htmlContent = htmlContent.replace(/\n/g, '');

      //         // Replace <span> elements with <img> elements
      //         htmlContent = htmlContent.replace(/<span([^>]*)data-src="([^"]*)"([^>]*)data-alt="([^"]*)"[^>]*><\/span>/g, '<img$1src="$2"$3alt="$4">');

      //         return htmlContent === null ? "" : htmlContent;
      //     });

      //     codeObj.htmlContent = htmlContent || "";
      //     // codecanyon scrap finish
      // }

      // codeObj.title = title;
      // codeObj.description = description;
      // codeObj.img = img;
      // codeObj.category = category;
      // codeObj.date = date;
      // codeObj.mongoDbDate = mongoDbDate;
      // codeObj.url = linkText
      // codeObj.downloadLinks = downloadLinks;
      // // codeDatasArray.push(codeObj)

      // resolve(codeObj);

    } catch (error) {
      console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

      reject(error);
    }
  })

}
