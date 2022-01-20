import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 2345,
  username: 'ft_world',
  password: 'ft_world',
  database: 'ft_world',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  synchronize: true,
  migrationsRun: false,
  logging: true,

  migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

export default config;
