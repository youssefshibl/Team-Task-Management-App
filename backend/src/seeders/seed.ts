import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserSeeder } from './user.seeder';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get Winston logger
  const logger = app.get<Logger>(WINSTON_MODULE_NEST_PROVIDER);

  // Get the seeder from the app context
  const userSeeder = app.get(UserSeeder);

  try {
    await userSeeder.seed();
  } catch (error) {
    logger.error('Error seeding users:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

void bootstrap();
