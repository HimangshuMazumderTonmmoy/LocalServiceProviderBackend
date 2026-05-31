import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) { } 

    async findMe (userID: number): Promise<User> {
        const user = await this.userRepo.findOne({
            where: { id: userID },
            relations: { providerProfile: true }, 
        });

        if (!user) throw new NotFoundException("User not found");

        return user;
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: { providerProfile: true },
        });

        if (!user) throw new NotFoundException(`User with id ${id} not found`);

        return user;
    }

    async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: { providerProfile: true },
        });

        if (!user) throw new NotFoundException('User not found');

        if (dto.fullName !== undefined) user.fullName = dto.fullName;
        if (dto.providerProfile && user.providerProfile) Object.assign(user.providerProfile, dto.providerProfile);

        return await this.userRepo.save(user);
    }

    async changePassword(userId: number, dto: ChangePasswordDto): Promise<{ message: string }> {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new NotFoundException('User not found');

        const isMatch = await bcrypt.compare(dto.oldPassword, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException('Old password is incorrect');

        user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.userRepo.save(user);

        return { message: 'Password changed successfully' };
    }
}
