import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { AccountStatus } from '../enums/account-status.enum';
import { User } from './user.entity';

@Entity('provider_profiles')
export class ProviderProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.providerProfile, { onDelete: 'CASCADE' })
  @JoinColumn() // // FK column 'userId' is created on THIS table (provider_profiles), not on users
  user: User;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.PENDING })
  status: AccountStatus;

  @Column()
  businessName: string;

  @Column()
  serviceCategory: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  createdAt: Date;
}