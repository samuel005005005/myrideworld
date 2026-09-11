import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('pasajeros')
export class PasajeroOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombreCompleto: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  telefono: string;

  @Column({ type: 'varchar' })
  passwordHash: string;

  @CreateDateColumn()
  fechaRegistro: Date;

  @Column({ type: 'varchar', default: 'Activo' })
  estado: string;
}
