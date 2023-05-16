import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { PdfBooksService } from './pdf-books.service';
import { Response } from 'express';

@Controller('pdf-books')
export class PdfBooksController {
  constructor(private readonly pdfBooksService: PdfBooksService) { }


  @Post('/postPdfBooks')
  async postPdfBooks(@Res() res: Response) {
    return await this.pdfBooksService.postPdfBookDatas(res);
  }

}
