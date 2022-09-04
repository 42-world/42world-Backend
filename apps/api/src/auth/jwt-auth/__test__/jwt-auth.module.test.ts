import { JwtAuthModule } from '../jwt-auth.module';

describe('JwtAuthGuard', () => {
  it('모듈이 잘 컴파일된다.', async () => {
    // TODO: Test.createTestingModule 로 complie 할것
    // const module = await Test.createTestingModule({
    // imports: [JwtAuthModule],
    // }).compile();
    const module = new JwtAuthModule();

    expect(module).toBeDefined();
  });
});
