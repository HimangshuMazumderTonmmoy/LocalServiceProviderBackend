import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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
}
