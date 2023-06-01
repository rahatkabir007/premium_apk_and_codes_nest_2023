
export const bookAuthorScrapping = async (authorId, page): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log('going to author page');
            const parsedAuthorId = parseInt(authorId)
            const authorObj: any = {}
            await page.waitForTimeout(5000)
            await page.goto(`https://yes-pdf.com/author/${parsedAuthorId}/books`);
            await page.waitForTimeout(2000)


            const srcs = await page.evaluate(() => {
                const imgs = Array.from(document.querySelectorAll('.author-photo img'));
                return imgs.map((img) => img.getAttribute('src'));
            });
            const authorTitle = await page.evaluate(() => {
                const element = document.querySelector('.author-info h1');
                return element ? element.textContent.trim() : null;
            });
            const authorDescription = await page.evaluate(() => {
                const elements = Array.from(document.querySelectorAll('.description-author p'));
                return elements.map((element) => element.textContent);
            });
            authorObj.title = authorTitle;
            authorObj.description = authorDescription.length === 0 ? [`Information about the author ${authorTitle} will soon be added to the site.`] : authorDescription;
            authorObj.img = `https://yes-pdf.com${srcs}`


            resolve(authorObj);

        } catch (error) {
            reject(error);
        }
    })

}
