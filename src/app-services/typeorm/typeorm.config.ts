import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

const options = (): DataSourceOptions => {
  return {
    type: 'mysql',
    host: configService.get('MYSQL_DATABASE_HOST'),
    port: configService.get('MYSQL_DATABASE_PORT'),
    username: configService.get('MYSQL_USER'),
    password: configService.get<string>('MYSQL_PASSWORD'),
    database: configService.get<string>('MYSQL_DATABASE'),
    entities: [
      join(
        process.cwd(),
        'dist',
        'app-services',
        'entities',
        '**',
        '*.entity.js',
      ),
    ],
    migrations: [
      join(process.cwd(), 'src', 'migrations', '**', 'migration.ts'),
    ],
    migrationsRun: true,
    // autoLoadEntities: true,
    migrationsTableName: 'migrations',
    logging: true,
    synchronize: true,
  } as DataSourceOptions;
};

export const appDataSource = new DataSource(options());
