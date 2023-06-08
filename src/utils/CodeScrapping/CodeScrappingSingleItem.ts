export const codeScrappingSingleItem = async (page, lastDate, codeDatas, k): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log('going to details page item', k + 1);
            const codeObj: any = {}
            await page.waitForTimeout(5000)
            await page.goto(codeDatas[k].url, { waitUntil: 'load', timeout: 0 })
            await page.waitForTimeout(2000)
            const title = codeDatas[k].title;
            const description = codeDatas[k].description;
            const img = codeDatas[k].imgSrc;
            let category = codeDatas[k].category;
            if (category.includes("/")) {
                const parts = category.split("/");
                category = parts[1]
            }
            const date = codeDatas[k].date;
            const nullorTextDate = date || null;
            const dateC = new Date(nullorTextDate);
            const dateL = new Date(lastDate)
            if (dateL > dateC) {
                resolve("continue")
                return;
            }
            const mongoDbDate = dateC.toISOString();
            const downloadLinks = await page.evaluate(() => {
                //@ts-ignore
                const downloadLinksArr = document.getElementsByClassName('quote')[0].innerText.split("\n")
                return downloadLinksArr.filter((item) => item !== "");
            })

            //codecanyon scrap
            const linkText = await page.evaluate(() => {
                const link = document.querySelector('.single-body a');
                if (link) {
                    return link.textContent;
                } else {
                    const singleBodyElement = document.querySelector('.single-body');
                    if (singleBodyElement) {
                        const string = singleBodyElement.textContent;
                        const regex = /http:\/\/[^ \n\r\t\]]+/g;
                        const matches = string.match(regex);
                        if (matches && matches.length > 0) {
                            return matches[0];
                        }
                    }
                }
                return null;
            });

            await page.waitForTimeout(5000);

            if (linkText && linkText.includes("codecanyon")) {
                console.log("going to codecanyon");
                await page.goto(linkText, { waitUntil: 'load', timeout: 0 });
                await page.waitForTimeout(2000);

                const htmlContent = await page.evaluate(() => {
                    const element = document.querySelector('.user-html');
                    if (!element) {
                        return null; // Return null if the element is not found
                    }
                    let htmlContent = element.innerHTML;

                    // Replace newline characters with <br/>
                    htmlContent = htmlContent.replace(/\n/g, '');

                    // Replace <span> elements with <img> elements
                    htmlContent = htmlContent.replace(/<span([^>]*)data-src="([^"]*)"([^>]*)data-alt="([^"]*)"[^>]*><\/span>/g, '<img$1src="$2"$3alt="$4">');

                    return htmlContent;
                });

                codeObj.htmlContent = htmlContent || "";
                // codecanyon scrap finish
            }



            codeObj.title = title;
            codeObj.description = description;
            codeObj.img = img;
            codeObj.category = category;
            codeObj.date = date;
            codeObj.mongoDbDate = mongoDbDate;
            codeObj.url = linkText
            codeObj.downloadLinks = downloadLinks;
            // codeDatasArray.push(codeObj)

            resolve(codeObj);

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)
            resolve(null)
            reject(error);
            return;
        }
    })

}
