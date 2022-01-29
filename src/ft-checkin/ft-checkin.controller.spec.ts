import { Test, TestingModule } from '@nestjs/testing';
import { FtCheckinController } from './ft-checkin.controller';
import { FtCheckinService } from './ft-checkin.service';

describe('FtCheckinController', () => {
  let controller: FtCheckinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FtCheckinController],
      providers: [FtCheckinService],
    }).compile();

    controller = module.get<FtCheckinController>(FtCheckinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
