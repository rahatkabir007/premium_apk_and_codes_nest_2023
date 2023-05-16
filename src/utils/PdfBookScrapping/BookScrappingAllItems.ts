
export const bookScrappingAllItems = async (page, lastDate, i): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log("Going to the page", i);
            await page.waitForTimeout(10000)
            await page.goto(`https://codelist.cc/pgs/${i}/`, { waitUntil: 'load', timeout: 0 });


            // resolve();

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}
