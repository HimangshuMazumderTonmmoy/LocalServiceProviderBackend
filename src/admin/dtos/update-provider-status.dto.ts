import { IsEnum } from 'class-validator';
import { AccountStatus } from '../../users/enums/account-status.enum';

export class UpdateProviderStatusDto {
  @IsEnum(AccountStatus)
  status: AccountStatus;
}