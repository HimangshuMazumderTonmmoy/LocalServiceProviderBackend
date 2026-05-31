import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { ProviderProfile } from '../../users/entities/provider-profile.entity';
import { ServiceStatus } from '../enums/service-status.enum';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;

  @ManyToOne(() => ProviderProfile, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn()
  provider: ProviderProfile;           // FK: providerId on this table

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;              // soft-delete — set by softDelete()
}