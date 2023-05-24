import { Test, TestingModule } from '@nestjs/testing';
import { TorrentsController } from './torrents.controller';
import { TorrentsService } from './torrents.service';

describe('TorrentsController', () => {
  let controller: TorrentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TorrentsController],
      providers: [TorrentsService],
    }).compile();

    controller = module.get<TorrentsController>(TorrentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
