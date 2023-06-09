import { Injectable } from '@nestjs/common';
import { CreatePdfBookDto } from './dto/create-pdf-book.dto';
import { UpdatePdfBookDto } from './dto/update-pdf-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PdfBook, PdfBookDocument } from './schemas/pdfBooks.schema';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';
import { Model } from 'mongoose';
import { PdfBookAuthor, PdfBookAuthorDocument } from './schemas/pdfBooksAuthors.schema';
import { bookScrappingPageNumber } from 'src/utils/PdfBookScrapping/BookScrappingPageNumber';
import { bookScrappingAllItems } from 'src/utils/PdfBookScrapping/BookScrappingAllItems';
import { bookAuthorScrapping } from 'src/utils/PdfBookScrapping/BookAuthorScrapping';
import { bookDetailsScrapping } from 'src/utils/PdfBookScrapping/BookDetailsScrapping';


export interface pdfBookDataType {
  title: string;
  description: string;
  img: string;
  downloadLinks: string;
  page: number
}

export interface pdfBookAuthorDataType {
  _id: string,
  title: string;
  description: string;
  img: string;
  downloadLinks: string;
  authorBookCount: number
}
var isWorking = false;

@Injectable()
export class PdfBooksService {
  constructor(
    @InjectModel(PdfBook.name, DATABASE_CONNECTION.SCRAP_SERVER)
    private pdfBookModel: Model<PdfBookDocument>,
    @InjectModel(PdfBookAuthor.name, DATABASE_CONNECTION.SCRAP_SERVER)
    private pdfBookAuthorModel: Model<PdfBookAuthorDocument>
    // eslint-disable-next-line no-empty-function
  ) { }

  async postPdfBookDatas(res) {
    if (isWorking) {
      return res.status(409).json({ message: 'Work in progress' });
    }
    isWorking = true
    res.send('Scrapping Initiated');
    console.log("route hit");
    setTimeout(async () => {
      try {
        console.log('Set Timeout hit');
        //main codes
        //  page checking
        const lastPScrap = await this.pdfBookModel.find().sort({ page: 1 })
        const firstPScrap = await this.pdfBookModel.find().sort({ page: -1 })
        const lastPageScrap = lastPScrap[0]?.page || 0
        const firstPageScrap = firstPScrap[0]?.page || 0
        const pageGap = (firstPageScrap - lastPageScrap) || 0
        //  page checking
        const { lastPageNumber, page, browser } = await bookScrappingPageNumber();

        let bookDatas;
        for (let i = lastPageNumber - pageGap; i >= 1; i--) {
          const result: any = await bookScrappingAllItems(page, i);
          bookDatas = result;
          let bookObjArray = [];
          for (let j = bookDatas.length - 1; j >= 0; j--) {
            const bookDetails = await bookDetailsScrapping(bookDatas[j], page);
            if (bookDetails === null) {
              console.log('Skipping scraping for this page, moving to the next page');
              continue; // Move on to the next iteration of the loop
            }
            const authorData = []
            for (let k = 0; k < bookDetails.authorYesPdfId.length; k++) {
              const authorYesPdfIdArray = bookDetails.authorYesPdfId[k]
              const author = await this.pdfBookAuthorModel.find({ authorYesPdfId: authorYesPdfIdArray })
              if (author.length > 0) {
                const authorCollection = await this.pdfBookAuthorModel.find({ authorYesPdfId: authorYesPdfIdArray })
                const authorObj = {
                  _id: authorCollection[0]?._id,
                  title: authorCollection[0]?.title
                }
                authorData.push(authorObj);
                continue;
              }
              const authorDatas = await bookAuthorScrapping(authorYesPdfIdArray, page);
              authorDatas.authorYesPdfId = authorYesPdfIdArray
              await this.pdfBookAuthorModel.create(authorDatas);
              const authorCollection = await this.pdfBookAuthorModel.find({ authorYesPdfId: authorYesPdfIdArray })
              const authorObj = {
                _id: authorCollection[0]?._id,
                title: authorCollection[0]?.title
              }
              authorData.push(authorObj);
            }

            bookDetails.page = i
            bookDetails.authors = authorData
            bookObjArray.push(bookDetails)
          }
          const promises = bookObjArray.map(async (data) => {
            await this.pdfBookModel.findOneAndUpdate({ bookYesPdfId: data.bookYesPdfId }, { $setOnInsert: data }, { upsert: true, new: true });
          });

          await Promise.all(promises);
          console.log('DB insert', i, "page");
        }



        await browser.close();
        //main codes
        console.log('DB insert');
        isWorking = false;
        return "Inserted to DB"
      }
      catch (error) {
        console.error(error);
        isWorking = false;
        res.status(500).send('Error occurred during scraping');
      }
    }, 3000)
  }

  async postPdfBookDatasFromFirst(res) {
    if (isWorking) {
      return res.status(409).json({ message: 'Work in progress' });
    }
    isWorking = true
    res.send('Scrapping Initiated');
    console.log("route hit");
    setTimeout(async () => {
      try {
        console.log('Set Timeout hit');
        //main codes
        //  page checking
        const { lastPageNumber, page, browser } = await bookScrappingPageNumber();

        let bookDatas;
        for (let i = 1; i <= lastPageNumber; i++) {
          const result: any = await bookScrappingAllItems(page, i);
          bookDatas = result;
          let bookObjArray = [];
          for (let j = 0; j <= bookDatas.length; j++) {
            const url2 = bookDatas[j].url;
            const bookYesPdfId = url2.match(/\/book\/(\d+)/)[1];
            const findBook = await this.pdfBookModel.find({ bookYesPdfId: bookYesPdfId })
            if (findBook.length > 0) {
              continue;
            }
            const bookDetails = await bookDetailsScrapping(bookDatas[j], page);
            if (bookDetails === null) {
              console.log('Skipping scraping for this page, moving to the next page');
              continue; // Move on to the next iteration of the loop
            }
            const authorData = []
            for (let k = 0; k < bookDetails.authorYesPdfId.length; k++) {
              const authorYesPdfIdArray = bookDetails.authorYesPdfId[k]
              const author = await this.pdfBookAuthorModel.find({ authorYesPdfId: authorYesPdfIdArray })
              if (author.length > 0) {
                const authorCollection = await this.pdfBookAuthorModel.find({ authorYesPdfId: authorYesPdfIdArray })
                const authorObj = {
                  _id: authorCollection[0]?._id,
                  title: authorCollection[0]?.title
                }
                authorData.push(authorObj);
                continue;
              }
              const authorDatas = await bookAuthorScrapping(authorYesPdfIdArray, page);
              authorDatas.authorYesPdfId = authorYesPdfIdArray
              await this.pdfBookAuthorModel.create(authorDatas);
              const authorCollection = await this.pdfBookAuthorModel.find({ authorYesPdfId: authorYesPdfIdArray })
              const authorObj = {
                _id: authorCollection[0]?._id,
                title: authorCollection[0]?.title
              }
              authorData.push(authorObj);
            }

            bookDetails.page = i
            bookDetails.authors = authorData
            bookObjArray.push(bookDetails)
          }
          const promises = bookObjArray.map(async (data) => {
            await this.pdfBookModel.findOneAndUpdate({ bookYesPdfId: data.bookYesPdfId }, { $setOnInsert: data }, { upsert: true, new: true });
          });

          await Promise.all(promises);
          console.log('DB insert', i, "page");
        }



        await browser.close();
        //main codes
        console.log('DB insert');
        isWorking = false;
        return "Inserted to DB"
      }
      catch (error) {
        console.error(error);
        isWorking = false;
        res.status(500).send('Error occurred during scraping');
      }
    }, 3000)
  }

  async findAllBooksData(query: { page: number }) {
    console.log('query', query.page);
    const limit = 20;
    const page = query.page;
    const skipCount = ((page as number) - 1) * limit;

    const allBooksData = await this.pdfBookModel.aggregate([
      {
        $addFields: {
          numericBookYesPdfId: { $toDouble: "$bookYesPdfId" }
        }
      },
      {
        $sort: { numericBookYesPdfId: -1 }
      },
      {
        $project: {
          _id: 1,
          bookTitle: 1,
          img: 1,
          publishedYear: 1,
          authors: 1,
          shortDescription: 1
        }
      },
      {
        $skip: skipCount
      },
      {
        $limit: limit
      }
    ]).exec();

    const allBooksDataLength = await this.pdfBookModel.countDocuments().exec();

    return { allBooksData, allBooksDataLength };
  }


  async findAllBooksDataSearch(query: { search: string, page: number }) {
    console.log('query', query.search)
    console.log('page', query.page)
    const limit = 8;
    const searchValue = query.search;
    const page = query.page;
    const booksAllDataSearch = await this.pdfBookModel.find({
      $and: [
        { "bookTitle": { $regex: searchValue, $options: 'i' } },
        {
          $or: [
            { downloadLink: { $ne: 'https://yes-pdf.comundefined' } },
            { readingLink: { $ne: 'https://yes-pdf.comundefined' } }
          ]
        }
      ]
    }).limit(limit).skip(((page as number) - 1) * (limit))
    const booksAllDataLengthSearch = await this.pdfBookModel.find({
      $and: [
        { "bookTitle": { $regex: searchValue, $options: 'i' } },
        {
          $or: [
            { downloadLink: { $ne: 'https://yes-pdf.comundefined' } },
            { readingLink: { $ne: 'https://yes-pdf.comundefined' } }
          ]
        }
      ]
    }).count()
    return { booksAllDataSearch, booksAllDataLengthSearch }
  }


  async findOneBook(id: string) {
    const book = await this.pdfBookModel.findOne({ _id: id })
    return { book }
  }

  async findRandomizedBooks() {
    // function getRandomSubset(array, count) {
    //   const shuffledArray = array.slice(); // Create a copy of the original array
    //   for (let i = shuffledArray.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    //   }
    //   return shuffledArray.slice(0, count);
    // }

    // const allBooks = await this.pdfBookModel.find({
    //   $or: [
    //     { downloadLink: { $ne: "https://yes-pdf.comundefined" } },
    //     { readingLink: { $ne: "https://yes-pdf.comundefined" } }
    //   ]
    // });
    // const randomBooks = getRandomSubset(allBooks, 12);
    const randomBooks = await this.pdfBookModel.aggregate([
      {
        $match: {
          $or: [
            { downloadLink: "https://yes-pdf.comundefined" },
            { readingLink: "https://yes-pdf.comundefined" }
          ]
        }
      },
      { $sample: { size: 12 } }
    ]).exec();

    return { randomBooks };
  }

  async findAllAuthorsData(query: { page: number }) {
    console.log('query', query.page)
    const limit = 12;
    const page = query.page;
    const allAuthorsDatainital = await this.pdfBookAuthorModel.find().sort({ createdAt: -1 }).limit(limit).skip(((page as number) - 1) * (limit))
    const allAuthorsDataLength = await this.pdfBookAuthorModel.find().count();
    for (let i = 0; i < allAuthorsDatainital.length; i++) {
      const authorBooks = await this.pdfBookModel.aggregate([
        { $match: { authorYesPdfId: allAuthorsDatainital[i]?.authorYesPdfId } }
      ])
      const authorBookCount = authorBooks.length
      await this.pdfBookAuthorModel.updateOne(
        { _id: allAuthorsDatainital[i]._id },
        { $set: { authorBookCount: authorBookCount } },
        { upsert: true, new: true }
      );
    }
    const allAuthorsData = await this.pdfBookAuthorModel.find().sort({ createdAt: -1 }).limit(limit).skip(((page as number) - 1) * (limit))
    return { allAuthorsData, allAuthorsDataLength }
  }

  async findOneAuthor(id: string) {
    const author = await this.pdfBookAuthorModel.findOne({ _id: id })
    const authorBooks = await this.pdfBookModel.aggregate([
      { $match: { authorYesPdfId: author?.authorYesPdfId } }
    ])
    return { author, authorBooks }
  }

  async findAllSEOContents() {
    const cursor1 = this.pdfBookModel.find().sort({ createdAt: -1 }).lean().cursor();
    const books = [];

    await cursor1.eachAsync((doc) => {
      books.push(doc._id);
    });
    const cursor2 = this.pdfBookModel.find().sort({ createdAt: -1 }).lean().cursor();
    const authors = [];

    await cursor2.eachAsync((doc) => {
      authors.push(doc._id);
    });
    // const books = await this.pdfBookModel.find({
    //   $or: [
    //     { downloadLink: { $ne: "https://yes-pdf.comundefined" } },
    //     { readingLink: { $ne: "https://yes-pdf.comundefined" } }
    //   ]
    // }).sort({ createdAt: -1 });
    // const authors = await this.pdfBookAuthorModel.find().sort({ createdAt: -1 });
    return { books, authors }
  }

}
