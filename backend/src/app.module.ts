import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SeederModule } from './seeders/seeder.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './lib/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthJwtService } from './lib/services/jwt.service';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './lib/config/winston.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonModule.forRoot(winstonConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGODB_URI'),
        };
      },
    }),
    AuthModule,
    TaskModule,
    SeederModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthJwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
