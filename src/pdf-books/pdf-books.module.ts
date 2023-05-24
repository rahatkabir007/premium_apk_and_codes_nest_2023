import { Module } from '@nestjs/common';
import { PdfBooksService } from './pdf-books.service';
import { PdfBooksController } from './pdf-books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PdfBook, PdfBookSchema } from './schemas/pdfBooks.schema';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';
import { PdfBookAuthor, PdfBookAuthorSchema } from './schemas/pdfBooksAuthors.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PdfBook.name, schema: PdfBookSchema }], DATABASE_CONNECTION.SCRAP_SERVER),
    MongooseModule.forFeature([
      { name: PdfBookAuthor.name, schema: PdfBookAuthorSchema }], DATABASE_CONNECTION.SCRAP_SERVER),
  ],

  controllers: [PdfBooksController],
  providers: [PdfBooksService]
})
export class PdfBooksModule { }
