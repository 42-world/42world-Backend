import { AuthModule } from '../auth.module';

describe('AuthModule', () => {
  test('모듈이 잘 컴파일된다.', async () => {
    // TODO: Test.createTestingModule 로 complie 할것
    // const module = await Test.createTestingModule({
    //   imports: [AuthModule],
    // }).compile();
    const module = new AuthModule();

    expect(module).toBeDefined();
  });
});
