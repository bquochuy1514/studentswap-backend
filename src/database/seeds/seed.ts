import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { PackageSeeder } from './seeders';
import { CategorySeeder } from './seeders';

config();

const configService = new ConfigService();

// Tự động chọn path đúng theo môi trường
const isProduction = process.env.NODE_ENV === 'production';
const entitiesPath = isProduction
  ? ['dist/**/*.entity.js']
  : ['src/**/*.entity{.ts,.js}'];

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: entitiesPath,
  seeds: [CategorySeeder, PackageSeeder],
};

const dataSource = new DataSource(options);

dataSource
  .initialize()
  .then(async () => {
    console.log('🚀 Database connected!\n');
    console.log('='.repeat(50));

    await runSeeders(dataSource);

    console.log('='.repeat(50));
    console.log('\n✅ Seeding completed successfully!\n');

    await dataSource.destroy();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  });
