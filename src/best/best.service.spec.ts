import { Test, TestingModule } from '@nestjs/testing';
import { BestService } from './best.service';

describe('BestService', () => {
  let service: BestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BestService],
    }).compile();

    service = module.get<BestService>(BestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
