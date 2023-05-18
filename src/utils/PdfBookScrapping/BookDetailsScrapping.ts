
export const bookDetailsScrapping = async (bookDataUrl, page): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            console.log('going to details page item', bookDataUrl);
            await page.waitForTimeout(2000)
            await page.goto(`https://yes-pdf.com${bookDataUrl.url}`);
            await page.waitForTimeout(2000)

            const data = await page.evaluate(() => {
                const bookCoverImg = document.querySelector('.book-cover img');
                const bookLinks = document.querySelectorAll('.book-links a');
                const colH1 = document.querySelector('.col-lg-9 h1');
                const bookYear = document.querySelector('.book-year');
                const bookMetaTdList = document.querySelectorAll('.book-meta tbody tr td:nth-child(2)');
                const bookDescriptionDiv = document.querySelector('.book-description');

                const bookCoverSrc = bookCoverImg ? bookCoverImg.getAttribute('src') : null;
                const bookLinksHrefs = Array.from(bookLinks, link => link.getAttribute('href'));
                const colH1Text = colH1 ? colH1.textContent : null;
                const bookYearText = bookYear ? bookYear.textContent : null;
                const bookMetaData = Array.from(bookMetaTdList, td => {
                    const anchors = Array.from(td.querySelectorAll('a'));
                    const spans = Array.from(td.querySelectorAll('span'));
                    let content;

                    if (anchors.length > 0) {
                        content = anchors.map(anchor => anchor.textContent).join(', ');
                    } else if (spans.length > 0) {
                        content = spans.map(span => span.textContent).join(', ');
                    } else {
                        content = td.textContent;
                    }

                    return content;
                });
                const cleanedBookMetaData = bookMetaData.map(content => {
                    const cleanedContent = content.replace(/\n/g, '').replace(/\s+/g, ' ');
                    return cleanedContent.trim();
                });

                const bookDescriptionHTML = bookDescriptionDiv ? bookDescriptionDiv.innerHTML : null;

                const cleanedBookDescriptionHTML = bookDescriptionHTML
                    ? bookDescriptionHTML.replace(/\n/g, '').replace(/\s+/g, '')
                    : null;


                const authorName = document.querySelectorAll('.book-meta tbody tr:nth-child(3) td a');
                const authorYesPdfId = [];
                for (const el of authorName) {
                    const href = el.getAttribute('href');
                    const splitted = href.split('/author/');
                    if (splitted.length === 2) {
                        const number = splitted[1].split('/')[0];
                        authorYesPdfId.push(number);
                    }
                }

                const img = `https://yes-pdf.com${bookCoverSrc}`;
                const downloadLink = `https://yes-pdf.com${bookLinksHrefs[0]}`;
                const readingLink = `https://yes-pdf.com${bookLinksHrefs[1]}`;
                const bookTitle = colH1Text.replace(" Free Download", "");
                const publishedYear = bookYearText;
                const publisher = cleanedBookMetaData[0] === "" ? "Not Found" : cleanedBookMetaData[0];
                const genres = cleanedBookMetaData[1] === "" ? "Not Found" : cleanedBookMetaData[1];
                const authors = cleanedBookMetaData[2] === "" ? "Not Found" : cleanedBookMetaData[2];
                const bookPages = cleanedBookMetaData[3] === "" ? "Not Found" : cleanedBookMetaData[3];
                const language = cleanedBookMetaData[7] === "" ? "Not Found" : cleanedBookMetaData[7];
                const physicalForm = cleanedBookMetaData[8] === "" ? "Not Found" : cleanedBookMetaData[8];
                const type = cleanedBookMetaData[9] === "" ? "Not Found" : cleanedBookMetaData[9];




                return {
                    bookTitle,
                    img,
                    downloadLink,
                    readingLink,
                    publishedYear,
                    publisher,
                    genres,
                    authors,
                    bookPages,
                    language,
                    physicalForm,
                    type,
                    description: cleanedBookDescriptionHTML,
                    authorYesPdfId,

                };
            });


            const url2 = bookDataUrl.url;
            const bookYesPdfId = url2.match(/\/book\/(\d+)/)[1];
            data.bookYesPdfId = bookYesPdfId
            resolve(data);

        } catch (error) {
            reject(error);
        }
    })

}
