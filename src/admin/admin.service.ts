import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ProviderProfile } from '../users/entities/provider-profile.entity';
import { Service } from '../services/entities/service.entity';
import { Role } from '../users/enums/role.enum';
import { AccountStatus } from '../users/enums/account-status.enum';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UpdateProviderStatusDto } from './dtos/update-provider-status.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ProviderProfile) private providerProfileRepo: Repository<ProviderProfile>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
  ) {}

  // ------------------ USER MANAGEMENT ------------------

  async findAllUsers() {
    return await this.userRepo.find({ relations: { providerProfile: true } });
  }

  async findUserById(id: number) {
    const user = await this.userRepo.findOne({ where: { id }, relations: { providerProfile: true } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUserRole(id: number, dto: UpdateUserRoleDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.role = dto.role;
    return this.userRepo.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id }, relations: { providerProfile: true } });

    if (!user) throw new NotFoundException('User not found');

    if (user.providerProfile) {
      await this.serviceRepo.delete({ provider: { id: user.providerProfile.id } });
      await this.providerProfileRepo.delete(user.providerProfile.id);
    }

    await this.userRepo.delete(id);
    return { message: 'User deleted successfully' };
  }

  // ------------------ PROVIDER APPROVAL ------------------

  async findPendingProviders() {
    // Find provider profiles that are pending approval
    return await this.providerProfileRepo.find({
      where: { status: AccountStatus.PENDING },
      relations: { user: true },
    });
  }

  async updateProviderStatus(id: number, dto: UpdateProviderStatusDto) {
    const provider = await this.providerProfileRepo.findOne({ where: { id } });
    if (!provider) throw new NotFoundException('Provider not found');

    provider.status = dto.status;
    await this.providerProfileRepo.save(provider);

    return { message: 'Provider status updated successfully' };
  }

  // ------------------ SERVICE MANAGEMENT ------------------

  async findAllServices() {
    return this.serviceRepo.find({ relations: { provider: true } });
  }

  async deleteService(id: number) {
    await this.serviceRepo.delete(id);
    return { message: 'Service deleted successfully' };
  }
}
