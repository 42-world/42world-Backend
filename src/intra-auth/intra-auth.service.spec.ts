import { Test, TestingModule } from '@nestjs/testing';
import { IntraAuthService } from './intra-auth.service';

describe('AuthenticateService', () => {
  let service: IntraAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntraAuthService],
    }).compile();

    service = module.get<IntraAuthService>(IntraAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
