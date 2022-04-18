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
import { Category } from '@app/entity/category/category.entity';
import { NotificationType } from '@app/entity/notification/interfaces/notifiaction.interface';
import { Notification } from '@app/entity/notification/notification.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { getConnection, Repository } from 'typeorm';
import { TestBaseModule } from './test.base.module';
import * as dummy from './utils/dummy';
import { clearDB, createTestApp } from './utils/utils';

describe('Notification', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let categoryRepository: CategoryRepository;
  let articleRepository: ArticleRepository;
  let notificationRepository: Repository<Notification>;
  let authService: AuthService;
  let JWT: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestBaseModule,
        UserModule,
        CategoryModule,
        ArticleModule,
        AuthModule,
        NotificationModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    app = createTestApp(moduleFixture);
    await app.init();

    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    categoryRepository =
      moduleFixture.get<CategoryRepository>(CategoryRepository);
    articleRepository = moduleFixture.get<ArticleRepository>(ArticleRepository);
    notificationRepository = moduleFixture.get<Repository<Notification>>(
      getRepositoryToken(Notification),
    );
    authService = moduleFixture.get<AuthService>(AuthService);

    app = app.getHttpServer();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
    await app.close();
  });

  beforeEach(async () => {
    await clearDB();
  });

  describe('/notifications', () => {
    let dummyUser: User;
    let dummyCategory: Category;
    let dummyArticle: Article;
    let dummyNotification: Notification;

    beforeEach(async () => {
      dummyUser = dummy.user(
        'test github uid',
        'first nickname',
        'github user name',
        UserRole.CADET,
      );
      await userRepository.save(dummyUser);
      dummyCategory = dummy.category('test category');
      await categoryRepository.save(dummyCategory);
      dummyArticle = dummy.article(
        dummyCategory.id,
        dummyUser.id,
        'title',
        'content',
      );
      await articleRepository.save(dummyArticle);
      dummyNotification = dummy.notification(
        NotificationType.NEW_COMMENT,
        dummyUser.id,
        dummyArticle.id,
        'notification content',
      );
      await notificationRepository.save(dummyNotification);
      JWT = dummy.jwt(dummyUser.id, dummyUser.role, authService);
    });

    test('[성공] GET - 알람 가져오기', async () => {
      const res = await request(app)
        .get('/notifications')
        .set('Cookie', `${process.env.ACCESS_TOKEN_KEY}=${JWT}`);
      expect(res.status).toEqual(HttpStatus.OK);
      expect(res.body[0].articleId).toEqual(dummyArticle.id);
      expect(res.body[0].type).toEqual(dummyNotification.type);
      expect(res.body[0].content).toEqual(dummyNotification.content);
    });

    test('[실패] GET - 로그인하지 않고 호출', async () => {
      const res = await request(app).get('/notifications');
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/notifications/readall', () => {
    let dummyUser: User;
    let dummyCategory: Category;
    let dummyArticle: Article;
    let dummyNotification1: Notification;
    let dummyNotification2: Notification;

    beforeEach(async () => {
      dummyUser = dummy.user(
        'test github uid',
        'first nickname',
        'github user name',
        UserRole.CADET,
      );
      await userRepository.save(dummyUser);
      dummyCategory = dummy.category('test category');
      await categoryRepository.save(dummyCategory);
      dummyArticle = dummy.article(
        dummyCategory.id,
        dummyUser.id,
        'title',
        'content',
      );
      await articleRepository.save(dummyArticle);
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
      JWT = dummy.jwt(dummyUser.id, dummyUser.role, authService);
    });

    test('[성공] PATCH - 알림 다 읽기', async () => {
      const res = await request(app)
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
      const res = await request(app).patch('/notifications/readall');
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
