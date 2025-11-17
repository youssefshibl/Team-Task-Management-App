import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserSeeder } from './user.seeder';
import { TaskSeeder } from './task.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false, // Disable default logger
  });

  // Get the seeders from the app context
  const userSeeder = app.get(UserSeeder);
  const taskSeeder = app.get(TaskSeeder);

  try {
    console.log('=== Starting Database Seeding ===');

    // Seed users first
    const { leaders, members } = await userSeeder.seed();

    // Seed tasks for members
    if (members.length > 0 && leaders.length > 0) {
      await taskSeeder.seed(leaders, members);
    } else {
      console.warn(
        'Skipping task seeding: No members or leaders found to assign tasks.',
      );
    }

    console.log('=== Database Seeding Completed Successfully ===');
  } catch (error) {
    console.error('Error during seeding:', error);

    // Log error details
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else if (typeof error === 'string') {
      console.error('Error string:', error);
    } else if (error && typeof error === 'object') {
      console.error('Error object:', JSON.stringify(error, null, 2));
      const errorObj = error as { message?: string; stack?: string };
      if (errorObj.message) {
        console.error('Error message from object:', errorObj.message);
      }
      if (errorObj.stack) {
        console.error('Error stack from object:', errorObj.stack);
      }
    } else {
      console.error('Unknown error type:', typeof error);
      console.error('Error value:', String(error));
    }

    process.exit(1);
  } finally {
    await app.close();
  }
}

void bootstrap();
