import { Delete, ForbiddenException, Injectable, NotFoundException, Param, ParseIntPipe, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dtos/create-service.dto';
import { ProviderProfile } from '../users/entities/provider-profile.entity';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { Role } from 'src/users/enums/role.enum';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    @InjectRepository(ProviderProfile) private providerProfileRepo: Repository<ProviderProfile>,
  ) {}

  private async checkOwnership(service: Service, userId: number): Promise<void> {
    const providerProfile = await this.providerProfileRepo.findOne({
      where: { id: service.provider.id },
      relations: { user: true },
    });
 
    if (!providerProfile || providerProfile.user.id !== userId) throw new ForbiddenException('You do not own this service');
  }

  async findMyServices(userId: number): Promise<Service[]> {
    const providerProfile = await this.providerProfileRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!providerProfile) throw new NotFoundException('Provider profile not found for this user');

    return await this.serviceRepo.find({
      where: { provider: { id: providerProfile.id } },
      relations: { provider: true },
    });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: { provider: true },
    });

    if (!service) throw new NotFoundException(`Service with ID ${id} not found`);

    return service;
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepo.find({
      relations: { provider: true },
    });
  }

  async create(createServiceDto: CreateServiceDto, userId: number): Promise<Service> {
    const providerProfile = await this.providerProfileRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!providerProfile) throw new NotFoundException('Provider profile not found for this user');

    const newService = this.serviceRepo.create({
      ...createServiceDto,
      provider: providerProfile,
    });

    return await this.serviceRepo.save(newService);
  }

  async update( id: number, userId: number, dto: UpdateServiceDto ): Promise<Service> {
    const service = await this.findOne(id);
    await this.checkOwnership(service, userId);
 
    Object.assign(service, dto);
    return this.serviceRepo.save(service);
  }

  async remove(id: number, userId: number, role: Role): Promise<{ message: string }> {
    const service = await this.findOne(id);
 
    if (role !== Role.ADMIN) await this.checkOwnership(service, userId);
 
    await this.serviceRepo.delete(id);
    return { message: 'Service deleted successfully' };
  }
}
