
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

            // authorObj.title = authorTitle;
            // authorObj.description = authorDescription;
            // authorObj.img = `https://yes-pdf.com${srcs}`


            // resolve();

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}
