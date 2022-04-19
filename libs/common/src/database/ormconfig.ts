import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { init1643517276502 } from './migrations/1643517276502-init';
import { addNotificationArticleid1644422087542 } from './migrations/1644422087542-add_notification_articleid';
import { addCategoryRoles1644473307391 } from './migrations/1644473307391-add_category_roles';
import { intraAuth1645622620898 } from './migrations/1645622620898-intra-auth';

init1643517276502;
addNotificationArticleid1644422087542;
addCategoryRoles1644473307391;
intraAuth1645622620898;

export interface IOrmconfig {
  ormconfig: ConnectionOptions;
}

export const ormconfig = (): IOrmconfig => ({
  ormconfig: {
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '2345', 10),
    username: process.env.DB_USER_NAME ?? 'ft_world',
    password: process.env.DB_USER_PASSWORD ?? 'ft_world',
    database: process.env.DB_NAME ?? 'ft_world',
    entities: [__dirname + '../../../../**/*.entity{.ts,.js}'],
    namingStrategy: new SnakeNamingStrategy(),

    timezone: '+09:00', // KST

    synchronize: false,
    migrationsRun: true,
    logging: process.env.NODE_ENV === 'dev',

    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: 'libs/common/src/database/migrations',
    },
  },
});

export default ormconfig().ormconfig;
