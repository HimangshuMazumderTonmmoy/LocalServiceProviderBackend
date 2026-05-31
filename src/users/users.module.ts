import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProviderProfile } from './entities/provider-profile.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProviderProfile])],
  exports: [TypeOrmModule], controllers: [UsersController], 
  providers: [UsersService, RolesGuard],
})
export class UsersModule {}
