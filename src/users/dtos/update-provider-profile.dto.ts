import { IsOptional, IsString, MaxLength, IsPhoneNumber } from 'class-validator';

export class UpdateProviderProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  businessName?: string;

  @IsOptional()
  @IsString()
  serviceCategory?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}