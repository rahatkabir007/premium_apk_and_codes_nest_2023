import { Test, TestingModule } from '@nestjs/testing';
import { HustleService } from './hustle.service';

describe('HustleService', () => {
  let service: HustleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HustleService],
    }).compile();

    service = module.get<HustleService>(HustleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
