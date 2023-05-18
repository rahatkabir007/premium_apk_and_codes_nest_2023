
export const bookAuthorIdScrapping = async (bookDataUrl, page): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log('going to details page item', bookDataUrl);
            await page.waitForTimeout(2000)
            await page.goto(`https://yes-pdf.com${bookDataUrl.url}`);
            await page.waitForTimeout(2000)
            const hrefs = await page.$$eval('.book-meta tbody tr:nth-child(3) td a', (elements) => {
                return elements.map((el) => {
                    const href = el.href;
                    const splitted = href.split('/author/');
                    if (splitted.length === 2) {
                        const number = splitted[1].split('/')[0];
                        return number;
                    }
                    return null;
                });
            });

            console.log(hrefs);

            resolve(hrefs);

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}
