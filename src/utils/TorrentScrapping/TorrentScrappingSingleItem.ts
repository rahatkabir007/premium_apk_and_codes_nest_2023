
// const apkScrapDataArray: any = [];
export const torrentScrappingSingleItem = async (page: any, lastDate: any, allReadMoreHref: any, j: any): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            // for (var j = 0; j < 1; j++) {
            var apkObj: any = {}
            await page.goto(allReadMoreHref[j])
            await page.waitForLoadState('load');
            await page.waitForTimeout(2000);

            const created = await page.evaluate(() => {
                const creat = document?.getElementsByClassName('entry-date published')[0]?.textContent || ''
                return creat
            })
            // const createdN = document.getElementsByClassName('entry-date published')[0].textContent || null
            const createdN = created || null
            console.log('created', createdN)
            const dateC = new Date(createdN ? createdN : null);
            const dateL = new Date(lastDate)
            if (dateL > dateC) {
                console.log('hee')
                resolve("continue")
                return
            }
            const createdDate = dateC.toISOString();
            const categoriesInnerText = await page.evaluate(() => {
                const cat = document?.getElementsByClassName('post-categories')[0]?.getElementsByTagName('a')[0]?.textContent || ''
                return cat
            })

            const title = await page.evaluate(() => {
                const tit = document?.getElementsByClassName('entry-title')[0]?.textContent || ''
                return tit
            })
            const tags = await page.evaluate(() => {
                const tag = document?.getElementsByClassName('thetags')[0]?.textContent || ''
                return tag
            })
            const htmlContent = await page.evaluate(() => {
                const element = document?.getElementsByClassName('entry-content')
                if (!element) {
                    return null; // Return null if the element is not found 
                }
                let htmlContent = element[0]?.innerHTML;

                // Replace newline characters with <br/>
                htmlContent = htmlContent.replace(/\n/g, '');

                // Replace <span> elements with <img> elements
                // htmlContent = htmlContent.replace(/<span([^>]*)data-src="([^"]*)"([^>]*)data-alt="([^"]*)"[^>]*><\/span>/g, '<img$1src="$2"$3alt="$4">');

                return htmlContent === null ? "" : htmlContent;
            });

            const imgSrc = await page.evaluate(() => {
                const img = document.getElementsByClassName('code-block code-block-7')[0].nextElementSibling.getAttribute('src')
                return img
            })
            const comment = await page.evaluate(() => {
                const com = document.getElementsByClassName('comments')[0].textContent
                return com
            })

            const allText = await page.evaluate(() => {
                const entryContent = document?.querySelector('.entry-content');

                const extractData = (element) => {
                    const extractedData = [];

                    const processNode = (node) => {
                        if (node?.nodeType === Node?.TEXT_NODE) {
                            const text = node?.textContent.trim() || '';
                            if (text !== '' && !text.includes('adsbygoogle')) {
                                // Check if the text has bold font styling
                                const computedStyle = window.getComputedStyle(node.parentElement);
                                const isBold = computedStyle.fontWeight === 'bold' || computedStyle.fontWeight === '700';
                                // Concatenate 'bold' with the text if it has bold font styling
                                const modifiedText = isBold ? 'bold: ' + text : text;
                                // textArray.push(modifiedText);
                                extractedData.push(modifiedText);
                            }
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.nodeName === 'IMG') {
                                const src = node?.getAttribute('src') || '';
                                if (src && !src.includes('https://www.freecoursesonline.me/wp-content/uploads/2017/09/zzzz.png')) {
                                    extractedData.push('imgSrc: ' + src);
                                }
                            } else {
                                Array.from(node?.childNodes).forEach(processNode);
                            }
                        }
                    };

                    Array.from(element?.childNodes).forEach(processNode);

                    return extractedData;
                };

                const extractedData = extractData(entryContent);
                console.log(extractedData);
                return extractedData
            })

            const downloadLink = await page.evaluate(() => {
                // Find all <a> elements on the page
                var aElements = document.getElementsByTagName('a');

                // Loop through each <a> element
                for (var i = 0; i < aElements.length; i++) {
                    var aElement = aElements[i];

                    // Check if the <a> element has a child <img> element
                    if (aElement.getElementsByTagName('img').length > 0) {
                        var imgElement = aElement.getElementsByTagName('img')[0];

                        // Check if the source of the child <img> element matches the desired value
                        if (imgElement.src === 'https://www.freecoursesonline.me/wp-content/uploads/2017/09/zzzz.png') {
                            var hrefValue = aElement.href;
                            console.log(hrefValue);
                            break; // Stop the loop after finding the first match (if there are multiple)
                        }
                    }
                }
                return hrefValue
            })



            apkObj.title = title
            apkObj.imgSrc = imgSrc
            apkObj.created = created
            apkObj.createdDate = createdDate
            apkObj.categories = categoriesInnerText
            apkObj.tags = tags || ''
            apkObj.htmlContent = htmlContent || "";
            apkObj.allText = allText
            apkObj.comment = comment
            apkObj.downloadLink = downloadLink
            // apkObj.version = version
            // apkObj.fileSize = fileSize
            // apkObj.developer = developer
            // apkObj.allText = allInnerDescription
            // apkObj.imgSrcAll = imgSrcAll
            // apkObj.requiredAndroid = requiredAndroid
            // apkObj.downloadFile = newPageExtractedMetaTags
            console.log('apkObjLast', apkObj)

            // apkScrapDataArray.push(apkObj)
            // }

            resolve(apkObj)

            // console.log('going to details page item', k + 1);
            // const codeObj: any = {}
            // await page.waitForTimeout(5000)
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
            // await page.waitForTimeout(5000);
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
