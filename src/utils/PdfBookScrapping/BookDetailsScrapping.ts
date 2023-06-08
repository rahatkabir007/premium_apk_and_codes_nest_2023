
export const bookDetailsScrapping = async (bookData, page): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log('going to details page item', bookData);
            await page.waitForTimeout(5000)
            await page.goto(`https://yes-pdf.com${bookData.url}`);
            await page.waitForTimeout(2000);


            const isForbidden = await page.evaluate(() => {
                const h1Element = document.querySelector('h1');
                return h1Element && h1Element.textContent.includes('403 Forbidden');
            });

            if (isForbidden) {
                console.log('Page is forbidden. Skipping scraping for:', bookData);
                resolve(null);
                return;
            }


            const data = await page.evaluate(() => {
                const bookCoverImg = document.querySelector('.book-cover img');
                const bookLinks = document.querySelectorAll('.book-links a');
                const colH1 = document.querySelector('.col-lg-9 h1');
                const bookYear = document.querySelector('.book-year');
                const bookDescriptionDiv = document.querySelector('.book-description');

                const bookCoverSrc = bookCoverImg ? bookCoverImg.getAttribute('src') : null;
                const bookLinksHrefs = Array.from(bookLinks, link => link.getAttribute('href'));
                const colH1Text = colH1 ? colH1.textContent : null;
                const bookYearText = bookYear ? bookYear.textContent : null;

                const img = `https://yes-pdf.com${bookCoverSrc}`;
                const downloadLink = `https://yes-pdf.com${bookLinksHrefs[0]}`;
                const readingLink = `https://yes-pdf.com${bookLinksHrefs[1]}`;
                const bookTitle = colH1Text.replace(" Free Download", "");
                const publishedYear = bookYearText;

                const bookDescriptionHTML = bookDescriptionDiv ? bookDescriptionDiv.innerHTML : null;

                let modifiedHTML = bookDescriptionHTML.replace(/\n/g, '');

                // Remove multiple spaces but keep one space between words
                modifiedHTML = modifiedHTML.replace(/\s+/g, ' ');

                // Remove any tag other than <b>, <p>, <i>
                modifiedHTML = modifiedHTML.replace(/<(?!\/?(b|p|i)\b)[^>]*>/gi, '');

                const cleanedBookDescriptionHTML = bookDescriptionHTML
                    ? modifiedHTML
                    : null;

                const authorYesPdfId = [];
                const metadataRows = document.querySelector('.table.book-meta tbody').querySelectorAll('tr');
                const metadata = {};
                for (const row of metadataRows) {
                    let key = (row.querySelector('td:nth-child(1)') as HTMLElement).innerText.toLowerCase().replace(' ', '_').replace(':', '');
                    let value: any = '';

                    if (key === 'pages') {
                        key = 'bookPages';
                    } else if (key === 'physical_form') {
                        key = 'physicalForm';
                    } else if (key === 'isbn10') {
                        key = 'ISBN10';
                    }

                    const valueCell = row.querySelector('td:nth-child(2)') as HTMLElement;
                    const anchorTags = valueCell.querySelectorAll('a');

                    if (key === 'authors') {
                        value = Array.from(anchorTags).map((anchor) => {
                            const href = (anchor as HTMLAnchorElement).href;
                            const authorId = href.match(/author\/(\d+)\/books/)[1];
                            return authorId;
                        });
                        authorYesPdfId.push(...value);
                    } else {
                        value = valueCell.innerText;
                        metadata[key] = value;
                    }
                }




                return {
                    ...metadata,
                    bookTitle,
                    img,
                    downloadLink,
                    readingLink,
                    publishedYear,
                    description: cleanedBookDescriptionHTML,
                    authorYesPdfId,
                };
            });


            const url2 = bookData.url;
            const bookYesPdfId = url2.match(/\/book\/(\d+)/)[1];
            data.bookYesPdfId = bookYesPdfId
            data.shortDescription = bookData.shortDescription
            resolve(data);

        } catch (error) {
            reject(error);
            resolve(null);
        }
    })

}
