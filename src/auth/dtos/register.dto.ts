// src/auth/dto/register.dto.ts
import { Type } from 'class-transformer';
import {
  IsEmail, IsEnum, IsString, MinLength,
  Matches, MaxLength, ValidateIf, ValidateNested,
  IsPhoneNumber,
} from 'class-validator';
import { Role } from '../../users/enums/role.enum';
import { ProviderProfileDto } from './provider-profile.dto';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/, {
    message: 'Password must contain at least one capital or smaller letter, one number, and one special character',
  })
  password: string;

  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsEnum(Role)
  role: Role;

  @ValidateIf(o => o.role === Role.PROVIDER)
  @ValidateNested()
  @Type(() => ProviderProfileDto)
  providerProfile?: ProviderProfileDto;
}