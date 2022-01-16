import { Test, TestingModule } from '@nestjs/testing';
import { BestController } from './best.controller';
import { BestService } from './best.service';

describe('BestController', () => {
  let controller: BestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BestController],
      providers: [BestService],
    }).compile();

    controller = module.get<BestController>(BestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
