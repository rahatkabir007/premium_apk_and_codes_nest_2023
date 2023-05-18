import { Test, TestingModule } from '@nestjs/testing';
import { PdfBooksController } from './pdf-books.controller';
import { PdfBooksService } from './pdf-books.service';

describe('PdfBooksController', () => {
  let controller: PdfBooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfBooksController],
      providers: [PdfBooksService],
    }).compile();

    controller = module.get<PdfBooksController>(PdfBooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
