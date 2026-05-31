import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>
  ) { }

  private async issueTokens(user: User) {
    const payload = { sub: user.id, role: user.role }; // ← ONLY id + role, nothing sensitive

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET, // ← different secret for refresh
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async register(body: RegisterDto) {
    const existingUser = await this.userRepo.findOneBy({ email: body.email });
    if (existingUser) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(body.password, 10);

    const userEntity = this.userRepo.create({
      email: body.email,
      fullName: body.fullName,
      role: body.role,
      passwordHash,
      providerProfile: body.providerProfile ?? null,
    });
    await this.userRepo.save(userEntity);

    const tokens = await this.issueTokens(userEntity);

    await this.userRepo.update(userEntity.id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
    });

    return tokens;
  }
 
  async login(body: LoginDto) {
    let token = '';

    const user = await this.userRepo.findOneBy({ email: body.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(body.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return await this.issueTokens(user);
  }

  async refresh(userId: number, incomingRefreshToken: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const match = await bcrypt.compare(incomingRefreshToken, user.refreshToken);
    if (!match) throw new UnauthorizedException();

    const tokens = await this.issueTokens(user);

    return {accessToken: tokens.accessToken};
  }

  async logout(userId: number) {
    await this.userRepo.update(userId, { refreshToken: null });
    return { message: "Logout successful" };
  }
}
