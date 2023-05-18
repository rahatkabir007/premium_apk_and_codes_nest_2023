import { Test, TestingModule } from '@nestjs/testing';
import { TorrentsService } from './torrents.service';

describe('TorrentsService', () => {
  let service: TorrentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TorrentsService],
    }).compile();

    service = module.get<TorrentsService>(TorrentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
