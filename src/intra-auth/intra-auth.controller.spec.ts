import { Test, TestingModule } from '@nestjs/testing';
import { IntraAuthController } from './intra-auth.controller';
import { IntraAuthService } from './intra-auth.service';

describe('IntraAuthController', () => {
  let controller: IntraAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntraAuthController],
      providers: [IntraAuthService],
    }).compile();

    controller = module.get<IntraAuthController>(IntraAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
