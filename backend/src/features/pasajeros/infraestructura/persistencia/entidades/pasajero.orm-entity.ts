import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { EstadosPasajero } from '../../../../../compartidos/constantes/estados-pasajero.enum.js';

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

  @Column({ type: 'varchar', default: EstadosPasajero.ACTIVO })
  estado: string;
}
