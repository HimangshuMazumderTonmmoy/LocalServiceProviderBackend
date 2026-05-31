import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [AuthModule, UsersModule,
    
    ConfigModule.forRoot({ isGlobal: true }),   // makes ConfigService available everywhere

    TypeOrmModule.forRootAsync({                // reads from .env via ConfigService
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:     config.get('DB_HOST'),
        port:     config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }), ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
