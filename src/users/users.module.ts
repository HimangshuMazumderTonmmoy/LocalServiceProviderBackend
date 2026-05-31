import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProviderProfile } from './entities/provider-profile.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProviderProfile])], // register your entity here
  exports: [TypeOrmModule], controllers: [UsersController], providers: [UsersService],
})
export class UsersModule {}
