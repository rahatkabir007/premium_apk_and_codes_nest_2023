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


export interface pdfBookDataType {
  title: string;
  description: string;
  img: string;
  downloadLinks: string;
  page: number
}

export interface pdfBookAuthorDataType {
  title: string;
  description: string;
  img: string;
  downloadLinks: string;
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
        const bookLastDate = await this.pdfBookModel.find().sort({ mongoDbDate: -1 })
        const bookLastDt = bookLastDate[0]?.date || ''
        const lastPScrap = await this.pdfBookModel.find().sort({ page: 1 })
        const firstPScrap = await this.pdfBookModel.find().sort({ page: -1 })
        const lastPageScrap = lastPScrap[0]?.page || 0
        const firstPageScrap = firstPScrap[0]?.page || 0
        const pageGap = (firstPageScrap - lastPageScrap) + 1 || 0
        //  page checking
        const { lastPageNumber, page, browser } = await bookScrappingPageNumber();

        let bookDatas;
        // for (let i = lastPageNumber - pageGap; i >= 1; i--) {
        for (let i = lastPageNumber; i >= 1; i--) {
          const result: any = await bookScrappingAllItems(page, bookLastDt, i);
          // if (result === "continue") {
          //   continue;
          // }
          bookDatas = result;
          // if (bookDatas.length === 0) {
          //   break;
          // }
          let codeObjArray = [];
          for (let j = bookDatas.length - 1; j >= 0; j--) {
            const authorYesPdfIdArray = await bookAuthorScrapping(bookDatas, j, page)
            authorYesPdfIdArray.map(async authorYesPdfId => {
              const author = await this.pdfBookAuthorModel.find({ authorYesPdfId: authorYesPdfId })
              console.log("🚀 ~ file: pdf-books.service.ts:78 ~ setTimeout ~ author:", author)
            })
          }
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

}
