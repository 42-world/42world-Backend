import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleRepository } from '@webhook/slack/repositories/article.repository';
import { SlackRepository } from '@webhook/slack/repositories/slack.repository';
import { SlackModule } from '@webhook/slack/slack.module';
import { CATEGORY_NOTICE_ID } from '@webhook/slack/slack.service';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { E2eTestBaseModule } from './e2e-test.base.module';
import { createMessageEvent } from './utils/dummy';
import { clearDB, createTestApp } from './utils/utils';

describe('Slack', () => {
  let httpServer: INestApplication;

  let slackRepository: SlackRepository;
  let articleRepository: ArticleRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [E2eTestBaseModule, SlackModule],
    }).compile();

    const app = createTestApp(moduleFixture);
    await app.init();

    slackRepository = moduleFixture.get(SlackRepository);
    articleRepository = moduleFixture.get(ArticleRepository);

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await httpServer.close();
  });

  beforeEach(async () => {
    await clearDB();
  });

  describe('/slack', () => {
    // beforeEach(async () => {
    //   await slackRepository.save({
    //     clientMsgId: 'clientMsgId',
    //     text: 'text',
    //     user: 'user',
    //     channel: 'channel',
    //     ts: 'ts',
    //   });
    // });

    test('[성공] POST - challenge', async () => {
      const res = await request(httpServer)
        .post('/slack')
        .send({ challenge: 'test' });

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toEqual({ challenge: 'test' });
    });

    test('[성공] POST - 새로운 메세지', async () => {
      const req = createMessageEvent(process.env.SLACK_NOTICE_CHANNEL);
      const res = await request(httpServer).post('/slack').send(req);

      expect(res.status).toBe(HttpStatus.CREATED);

      const slack = await slackRepository.findOne({
        clientMsgId: req.event.client_msg_id,
      });

      const article = await articleRepository.findOne({
        slackId: slack.id,
      });
      expect(slack).toBeDefined();
      expect(slack.clientMsgId).toBe(req.event.client_msg_id);
      expect(slack.text).toBe(req.event.text);
      expect(slack.user).toBe(req.event.user);
      expect(slack.channel).toBe(req.event.channel);
      expect(slack.ts).toBe(req.event.ts);
      expect(article).toBeDefined();
      expect(article.title).toBeDefined(); //TODO: 실제 값 비교
      expect(article.content).toBeDefined();
      expect(article.categoryId).toBe(CATEGORY_NOTICE_ID);
      expect(article.writerId).toBe(process.env.SLACK_WRITER_ID);
    });

    // [실패] 새로운 메세지가 있는데 또 만들라고 하는경우

    test.skip('[성공] POST - 메세지 변경', async () => {
      // test
    });

    // [실패] 메세지 수정하려는데 sslack 이 없는 경우
    // [실패] 메세지 수정하려는데 article 이 없는 경우 -> 꼭 해야할까?
    // 채널 다른거, event 가 message 가 아닌거,
    // event 가 message 이지만? subtype 이 message_changed 가 아닌경우
    // validate 에서 하나라도 틀린것이 있으면 실패
    // 파싱 형식이 달라지는것
    test.skip('[성공] POST - 채널 다른거', async () => {
      // test
    });
  });
});
