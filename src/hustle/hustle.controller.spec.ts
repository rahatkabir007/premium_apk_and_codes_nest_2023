import { Test, TestingModule } from '@nestjs/testing';
import { HustleController } from './hustle.controller';
import { HustleService } from './hustle.service';

describe('HustleController', () => {
  let controller: HustleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HustleController],
      providers: [HustleService],
    }).compile();

    controller = module.get<HustleController>(HustleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
