import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../enums/role.enum';
import { ProviderProfile } from './provider-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  refreshToken: string | null;

  @OneToOne(() => ProviderProfile, (profile) => profile.user, {
    cascade: true,  // when user is created, provider profile is also created
    nullable: true,   // provider profile is optional
    eager: false,   // when user is fetched, provider profile is not fetched
  })
  providerProfile: ProviderProfile | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}