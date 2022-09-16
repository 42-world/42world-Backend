import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { GithubAuthModule } from '../github-auth.module';

describe('GithubAuthModule', () => {
  test('모듈이 잘 컴파일된다.', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              GITHUB_CLIENT_ID: '123',
              GITHUB_CLIENT_SECRET: '123',
              GITHUB_CALLBACK_URL: '123',
            }),
          ],
        }),
        GithubAuthModule,
      ],
    }).compile();

    expect(module).toBeDefined();
  });
});
