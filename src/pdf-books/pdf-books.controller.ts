import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { PdfBooksService } from './pdf-books.service';
import { Response } from 'express';

@Controller('pdf-books')
export class PdfBooksController {
  constructor(private readonly pdfBooksService: PdfBooksService) { }


  @Post('/postPdfBooks')
  async postPdfBooks(@Res() res: Response) {
    return await this.pdfBooksService.postPdfBookDatas(res);
  }

  @Post('/updatePdfBooks')
  async updatePdfBooks(@Res() res: Response) {
    return await this.pdfBooksService.updatePdfBookDatas(res);
  }

  @Post('/updatePdfBookAuthorDatas')
  async updatePdfBookAuthorDatas(@Res() res: Response) {
    return await this.pdfBooksService.updatePdfBookAuthorDatas(res);
  }



  @Post('/postPdfBooksFromFirst')
  async postPdfBooksFromFirst(@Res() res: Response) {
    return await this.pdfBooksService.postPdfBookDatasFromFirst(res);
  }

  @Get('/findAllSEOContents')
  findAllSEOContents() {
    return this.pdfBooksService.findAllSEOContents()
  }

  @Get('/findAllBooks')
  async findAllBooks(@Query() queries: { page: number }) {
    return await this.pdfBooksService.findAllBooksData(queries);
  }

  @Get('/findAllBooksSearch')
  async findAllBooksBySearch(@Query() queries: { search: string, page: number }) {
    return await this.pdfBooksService.findAllBooksDataSearch(queries);
  }

  @Get('/findOneBook/:id')
  findOneBook(@Param('id') id: string) {
    return this.pdfBooksService.findOneBook(id);
  }

  @Get('/findRandomBooks')
  findTrendingCodes() {
    return this.pdfBooksService.findRandomizedBooks()
  }

  @Get('/findAllAuthors')
  async findAllAuthors(@Query() queries: { page: number }) {
    return await this.pdfBooksService.findAllAuthorsData(queries);
  }

  @Get('/findOneAuthor/:id')
  findOneAuthor(@Param('id') id: string) {
    return this.pdfBooksService.findOneAuthor(id);
  }

}
