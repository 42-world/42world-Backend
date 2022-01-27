import { Test, TestingModule } from '@nestjs/testing';
import { FtAuthController } from './ft-auth.controller';
import { FtAuthService } from './ft-auth.service';

describe('FtAuthController', () => {
  let controller: FtAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FtAuthController],
      providers: [FtAuthService],
    }).compile();

    controller = module.get<FtAuthController>(FtAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
