import { IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(100)
  fullName?: string;

  @IsOptional() @IsString()
  businessName?: string;

  @IsOptional() @IsPhoneNumber()
  phone?: string;
}