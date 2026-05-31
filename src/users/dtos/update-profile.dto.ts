// dtos/update-profile.dto.ts
import { IsOptional, IsString, MaxLength, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateProviderProfileDto } from './update-provider-profile.dto';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProviderProfileDto)
  providerProfile?: UpdateProviderProfileDto;
}