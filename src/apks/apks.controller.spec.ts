import { Test, TestingModule } from '@nestjs/testing';
import { ApksController } from './apks.controller';
import { ApksService } from './apks.service';

describe('ApksController', () => {
  let controller: ApksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApksController],
      providers: [ApksService],
    }).compile();

    controller = module.get<ApksController>(ApksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
