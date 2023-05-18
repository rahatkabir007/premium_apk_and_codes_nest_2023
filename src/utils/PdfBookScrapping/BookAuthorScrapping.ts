
export const bookAuthorScrapping = async (authorId, page): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log('going to author page');
            console.log("🚀 ~ file: BookAuthorScrapping.ts:3 ~ bookAuthorScrapping ~ authorId:", authorId)
            const parsedAuthorId = parseInt(authorId)
            const authorObj: any = {}
            await page.waitForTimeout(2000)
            await page.goto(`https://yes-pdf.com/author/${parsedAuthorId}/books`);
            await page.waitForTimeout(2000)

            // const srcs = await page.$$eval('.author-photo img', (imgs) => imgs.map((img) => img.getAttribute('src')));
            // const authorTitle = await page.$eval('.author-info h1', (element) => element.textContent);
            // const authorDescription = await page.$$eval('.description-author p', (elements) => {
            //     return elements.map((element) => element.textContent);
            // });
            const srcs = await page.evaluate(() => {
                const imgs = Array.from(document.querySelectorAll('.author-photo img'));
                console.log("🚀 ~ file: BookAuthorScrapping.ts:20 ~ srcs ~ imgs:", imgs)
                return imgs.map((img) => img.getAttribute('src'));
            });
            console.log("🚀 ~ file: BookAuthorScrapping.ts:22 ~ srcs ~ srcs:", srcs)

            const authorTitle = await page.evaluate(() => {
                const element = document.querySelector('.author-info h1');
                console.log("🚀 ~ file: BookAuthorScrapping.ts:26 ~ authorTitle ~ element:", element)
                return element ? element.textContent.trim() : null;
            });
            console.log("🚀 ~ file: BookAuthorScrapping.ts:28 ~ authorTitle ~ authorTitle:", authorTitle)

            const authorDescription = await page.evaluate(() => {
                const elements = Array.from(document.querySelectorAll('.description-author p'));
                console.log("🚀 ~ file: BookAuthorScrapping.ts:33 ~ authorDescription ~ elements:", elements)
                return elements.map((element) => element.textContent);
            });
            console.log("🚀 ~ file: BookAuthorScrapping.ts:34 ~ authorDescription ~ authorDescription:", authorDescription)


            console.log("🚀 ~ file: BookAuthorScrapping.ts:3 ~ bookAuthorScrapping ~ authorId:", authorId)
            authorObj.title = authorTitle;
            authorObj.description = authorDescription.length === 0 ? [`Information about the author ${authorTitle} will soon be added to the site.`] : authorDescription;
            authorObj.img = `https://yes-pdf.com${srcs}`


            resolve(authorObj);

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}
