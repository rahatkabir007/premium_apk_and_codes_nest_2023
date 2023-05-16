
export const bookScrappingAllItems = async (page, lastDate, i): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log("Going to the page", i);
            await page.waitForTimeout(10000)
            await page.goto(`https://yes-pdf.com/books/page/${i}`);
            //DATE Handle

            // const NextStep = await page.evaluate(() => {
            //     const elements = document.querySelectorAll('.book-attr .book-publishing-year');
            //     const texts = [];
            //     for (let i = 0; i < elements.length; i++) {
            //         const str = elements[i].textContent;
            //         const year = str.split(",")[0].trim();
            //         texts.push(year);
            //     }
            //     return texts
            // })
            // console.log("🚀 ~ file: BookScrappingAllItems.ts:18 ~ NextStep ~ NextStep:", NextStep)
            // const pageChange = () => {
            //     let text = []
            //     for (let j = 0; j < NextStep.length; j++) {
            //         console.log(NextStep[j]);
            //         if (new Date(lastDate) > new Date(NextStep[j] || null)) {
            //             text.push(true)
            //         }
            //         else {
            //             text.push(false)
            //         }
            //     }
            //     return text
            // }

            // console.log('pageChange()', pageChange())
            // if (pageChange().filter(value => value === true).length === NextStep.length) {
            //     resolve("continue")
            //     return; // Skip remaining code and move to next iteration
            // }

            //DATE Handle
            await page.waitForTimeout(2000)
            //Every Books Detail URL Extraction
            const bookDatas = await page.$$eval('.book', (bookData) => {
                console.log("🚀 ~ file: BookScrappingAllItems.ts:50 ~ bookDatas ~ bookData:", bookData)
                return bookData.map((el) => {
                    const url = el.querySelector('.book-cover a')?.getAttribute('href') ?? '';
                    return { url };
                });
            })

            console.log("🚀 ~ file: BookScrappingAllItems.ts:50 ~ bookDatas ~ bookDatas:", bookDatas)

            //Every Books Detail URL Extraction

            resolve(bookDatas);

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}
