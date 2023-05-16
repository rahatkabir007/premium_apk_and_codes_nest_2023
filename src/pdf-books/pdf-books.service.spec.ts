import { Test, TestingModule } from '@nestjs/testing';
import { PdfBooksService } from './pdf-books.service';

describe('PdfBooksService', () => {
  let service: PdfBooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfBooksService],
    }).compile();

    service = module.get<PdfBooksService>(PdfBooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
