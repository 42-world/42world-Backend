import { Article } from '@admin/entity/article/article.entity';
import { Best } from '@admin/entity/best/best.entity';
import { Category } from '@admin/entity/category/category.entity';
import { Comment } from '@admin/entity/comment/comment.entity';
import { IntraAuth } from '@admin/entity/intra-auth/intra-auth.entity';
import { Notification } from '@admin/entity/notification/notification.entity';
import { ReactionArticle } from '@admin/entity/reaction/reaction-article.entity';
import { ReactionComment } from '@admin/entity/reaction/reaction-comment.entity';
import { User } from '@admin/entity/user/user.entity';
import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export interface IOrmconfig {
  ormconfig: ConnectionOptions;
}

export const ormconfig = (): IOrmconfig => ({
  ormconfig: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
    entities: [IntraAuth, Best, Notification, Category, Comment, ReactionArticle, ReactionComment, User, Article],
    namingStrategy: new SnakeNamingStrategy(),

    timezone: 'Z', // UTC

    synchronize: false,
    logging: process.env.NODE_ENV === 'dev',
  },
});

export default ormconfig().ormconfig;
