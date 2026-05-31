import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { ProviderProfile } from '../users/entities/provider-profile.entity';
import { Service } from '../services/entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,           // user management — list, delete, change role
      ProviderProfile, // provider approval — pending list, status update
      Service,        // service management — list all, delete any
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}