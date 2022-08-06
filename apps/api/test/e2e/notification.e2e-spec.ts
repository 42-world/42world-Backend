import { ArticleModule } from '@api/article/article.module';
import { ArticleRepository } from '@api/article/repositories/article.repository';
import { AuthModule } from '@api/auth/auth.module';
import { AuthService } from '@api/auth/auth.service';
import { CategoryModule } from '@api/category/category.module';
import { CategoryRepository } from '@api/category/repositories/category.repository';
import { NotificationModule } from '@api/notification/notification.module';
import { UserRepository } from '@api/user/repositories/user.repository';
import { UserModule } from '@api/user/user.module';
import { Article } from '@app/entity/article/article.entity';
import { NotificationType } from '@app/entity/notification/interfaces/notifiaction.interface';
import { Notification } from '@app/entity/notification/notification.entity';
import { User } from '@app/entity/user/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { getConnection, Repository } from 'typeorm';
import { E2eTestBaseModule } from './e2e-test.base.module';
import * as dummy from './utils/dummy';
import { clearDB, createTestApp } from './utils/utils';

describe('Notification', () => {
  let httpServer: INestApplication;

  let userRepository: UserRepository;
  let categoryRepository: CategoryRepository;
  let articleRepository: ArticleRepository;
  let notificationRepository: Repository<Notification>;

  let authService: AuthService;
  let JWT: string;

  let users: dummy.DummyUsers;
  let categories: dummy.DummyCategories;
  let articles: dummy.DummyArticles;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [E2eTestBaseModule, UserModule, CategoryModule, ArticleModule, AuthModule, NotificationModule],
    }).compile();

    const app = createTestApp(moduleFixture);
    await app.init();

    userRepository = moduleFixture.get(UserRepository);
    categoryRepository = moduleFixture.get(CategoryRepository);
    articleRepository = moduleFixture.get(ArticleRepository);
    notificationRepository = moduleFixture.get(getRepositoryToken(Notification));
    authService = moduleFixture.get(AuthService);

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

  describe('/notifications', () => {
    let dummyUser: User;
    let dummyArticle: Article;
    let dummyNotification: Notification[];

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      dummyUser = users.cadet[0];
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(articleRepository, users, categories);
      dummyArticle = articles.first;
      dummyNotification = [
        dummy.notification(NotificationType.NEW_COMMENT, dummyUser.id, dummyArticle.id, 'notification content'),
        dummy.notification(NotificationType.NEW_COMMENT, dummyUser.id, dummyArticle.id, 'notification content 2'),
      ];
      await notificationRepository.save(dummyNotification);
      JWT = dummy.jwt(dummyUser, authService);
    });

    test('[성공] GET - 알람 가져오기', async () => {
      const res = await request(httpServer)
        .get('/notifications')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body[0].articleId).toEqual(dummyNotification[1].articleId);
      expect(res.body[0].type).toEqual(dummyNotification[1].type);
      expect(res.body[0].content).toEqual(dummyNotification[1].content);
      expect(res.body[1].articleId).toEqual(dummyNotification[0].articleId);
      expect(res.body[1].type).toEqual(dummyNotification[0].type);
      expect(res.body[1].content).toEqual(dummyNotification[0].content);
    });

    test('[실패] GET - 로그인하지 않고 호출', async () => {
      const res = await request(httpServer).get('/notifications');
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/notifications/readall', () => {
    let dummyUser: User;
    let dummyArticle: Article;
    let dummyNotification1: Notification;
    let dummyNotification2: Notification;

    beforeEach(async () => {
      users = await dummy.createDummyUsers(userRepository);
      dummyUser = users.cadet[0];
      categories = await dummy.createDummyCategories(categoryRepository);
      articles = await dummy.createDummyArticles(articleRepository, users, categories);
      dummyArticle = articles.first;
      dummyNotification1 = dummy.notification(
        NotificationType.NEW_COMMENT,
        dummyUser.id,
        dummyArticle.id,
        'notification content',
      );
      dummyNotification2 = dummy.notification(
        NotificationType.NEW_COMMENT,
        dummyUser.id,
        dummyArticle.id,
        'notification content',
      );
      await notificationRepository.save(dummyNotification1);
      await notificationRepository.save(dummyNotification2);
      JWT = dummy.jwt(dummyUser, authService);
    });

    test('[성공] PATCH - 알림 다 읽기', async () => {
      const res = await request(httpServer)
        .patch('/notifications/readall')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(res.status).toEqual(HttpStatus.OK);
      const readNotifications = await notificationRepository.find({
        userId: dummyUser.id,
      });
      expect(readNotifications.length).toEqual(2);
      expect(readNotifications[0].isRead).toEqual(true);
      expect(readNotifications[1].isRead).toEqual(true);
    });

    test('[실패] PATCH - 로그인하지 않고 호출', async () => {
      const res = await request(httpServer).patch('/notifications/readall');
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
