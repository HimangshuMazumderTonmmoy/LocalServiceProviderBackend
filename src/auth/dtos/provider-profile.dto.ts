import { IsString, MaxLength, IsPhoneNumber } from 'class-validator';

export class ProviderProfileDto {
  @IsString()
  @MaxLength(50)
  businessName: string;

  @IsString()
  serviceCategory: string;

  @IsPhoneNumber()
  phone: string;
}