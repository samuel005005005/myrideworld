import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('zonas_tarifario')
export class ZonaTarifaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @CreateDateColumn()
  fechaRegistro: Date;
}
