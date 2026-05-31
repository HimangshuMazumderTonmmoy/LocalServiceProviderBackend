import { IsString, IsNumber, IsPositive, MaxLength, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceStatus } from '../enums/service-status.enum';

export class CreateServiceDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)              
  price: number;

  @IsString()
  @MaxLength(50)
  category: string;

  @IsString()
  @MaxLength(100)
  location: string;

  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;  
}        