export const bookScrappingAllItems = async (page, i): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log("Going to the page", i);
            await page.waitForTimeout(10000)
            await page.goto(`https://yes-pdf.com/books/page/${i}`);

            await page.waitForTimeout(2000)
            //Every Books Detail URL Extraction
            const bookDatas = await page.$$eval('.book', (bookData) => {
                return bookData.map((el) => {
                    const shortDescription = el.querySelector('.book-short-description').textContent.trim();
                    const url = el.querySelector('.book-cover a')?.getAttribute('href') ?? '';
                    return { url, shortDescription };
                });
            })
            //Every Books Detail URL Extraction

            resolve(bookDatas);

        } catch (error) {
            reject(error);
        }
    })

}
