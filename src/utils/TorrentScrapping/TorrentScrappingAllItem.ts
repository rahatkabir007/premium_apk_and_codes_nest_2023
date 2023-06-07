export const torrenScrappingAllItems = async (page, lastDate, i, type): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            //// for (var i = 1; i < 4; i++) {
            // //from front
            // for (var i = 1;i<=totalP ; i++) {
            console.log('iindex', i)
            await page.goto(`https://www.freecoursesonline.me/page/${i}/?0`);

            const NextStep = await page.evaluate(() => {

                const elements = document.getElementsByClassName('entry-date published');
                console.log('elements', elements)
                const texts = [];
                for (let i = 0; i < elements.length; i++) {
                    texts.push(elements[i].textContent);
                }
                console.log(texts);
                return texts
            })
            console.log('nextstep', NextStep)
            // //from front
            //   for (let k = 0; k < NextStep.length; k++) {
            //     console.log(NextStep[k]);
            //     if (new Date(lastDate) > new Date(NextStep[k])) {
            //       console.log('true', new Date(lastDate) > new Date(NextStep[k]))
            //       totalP=i
            //       break
            //     }
            //   }
            console.log('lastDate', lastDate);
            // from back
            const pageChange = () => {
                let text = []
                for (let k = 0; k < NextStep.length; k++) {
                    console.log(NextStep[k]);
                    if (type === 'initial') {
                        if (new Date(lastDate) > new Date(NextStep[k] || null)) {
                            //   console.log('true', new Date(lastDate) > new Date(NextStep[k]))
                            text.push(true)
                        }
                        else {
                            text.push(false)
                        }
                    }
                    else {
                        if (new Date(lastDate) > new Date(NextStep[k] || null)) {
                            //   console.log('true', new Date(lastDate) > new Date(NextStep[k]))
                            text.push(true)
                        }
                        else {
                            text.push(false)
                        }
                    }
                }
                return text
            }

            console.log('pageChange()', pageChange())
            if (type === 'initial') {
                if (pageChange().filter(value => value === true).length === NextStep.length) {
                    //   console.log()
                    resolve("continue")
                    return
                }
            }
            else {
                console.log('not initial')
                if (pageChange().filter(value => value === true).length === NextStep.length) {
                    resolve("break")
                    return
                }
            }

            const allReadMoreHref = await page.evaluate(() => {
                const readMoreArray = [];
                const readMoreElements = document.querySelectorAll('.readmore');
                console.log('metaTagElements', readMoreElements);
                readMoreElements.forEach(readMoreElement => {
                    const href = readMoreElement.getElementsByTagName('a')[0].href || '';
                    readMoreArray.push(href);
                });
                return readMoreArray;
            });
            // if (allReadMoreHref.length === 0) {
            //   console.log('break')
            //   break;
            // }

            resolve(allReadMoreHref)






            // console.log("Going to the page", i);
            // await page.waitForTimeout(10000)
            // await page.goto(`https://codelist.cc/pgs/${i}/`);

            // const NextStep = await page.evaluate(() => {
            //     const elements = document.querySelectorAll('.post--vertical .post__text .post__meta a time');
            //     const texts = [];
            //     for (let i = 0; i < elements.length; i++) {
            //         texts.push(elements[i].textContent);
            //     }
            //     console.log(texts);
            //     return texts
            // })
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
            // await page.waitForTimeout(2000)
            // const codeDatas = await page.$$eval('.post--vertical', (codeData) => {
            //     return codeData.map((el) => {
            //         const url = el.querySelector('.post__thumb a')?.getAttribute('href') ?? '';
            //         const title = el.querySelector('.post__text .post__title a')?.textContent?.trim() ?? '';
            //         const description = el.querySelector('.post__text .post__excerpt')?.textContent?.trim() ?? '';
            //         const imgSrc = el.querySelector('img')?.src ?? '';
            //         const category = el.querySelector('.post__text .post__meta span a')?.textContent?.trim() ?? '';
            //         const date = el.querySelector('.post__text .post__meta a time')?.textContent?.trim() ?? '';

            //         return { url, title, description, imgSrc, category, date };
            //     });
            // });
            // // if (codeDatas.length === 0) {
            // //     return
            // //     // break;
            // // }
            // resolve(codeDatas);

        } catch (error) {
            console.log("🚀 ~ file: test.ts:29 ~ returnnewPromise ~ error:", error)

            reject(error);
        }
    })

}
