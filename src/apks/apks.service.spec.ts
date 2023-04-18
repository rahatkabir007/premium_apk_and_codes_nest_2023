import { Test, TestingModule } from '@nestjs/testing';
import { ApksService } from './apks.service';

describe('ApksService', () => {
  let service: ApksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApksService],
    }).compile();

    service = module.get<ApksService>(ApksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
