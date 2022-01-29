import { Test, TestingModule } from '@nestjs/testing';
import { FtCheckinService } from './ft-checkin.service';

describe('FtCheckinService', () => {
  let service: FtCheckinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FtCheckinService],
    }).compile();

    service = module.get<FtCheckinService>(FtCheckinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
