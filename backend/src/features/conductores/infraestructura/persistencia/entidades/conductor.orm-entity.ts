import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { EstadosConductor } from '../../../../../compartidos/constantes/estados-conductor.enum.js';
import { EstadosDisponibilidadConductor } from '../../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';

@Entity('conductores')
@Index(['estadoAprobacion', 'estadoDisponibilidad'])
export class ConductorOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombreCompleto: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'telefono', type: 'varchar', length: 20 })
  telefono: string;

  @Column({ name: 'password_hash', type: 'varchar' })
  passwordHash: string;

  @Column({ name: 'foto_url', type: 'varchar', nullable: true })
  fotoUrl: string;

  @Column({ type: 'varchar' })
  vehiculoMarca: string;

  @Column({ type: 'varchar' })
  vehiculoModelo: string;

  @Column({ type: 'varchar' })
  vehiculoColor: string;

  @Column({ type: 'varchar', unique: true })
  vehiculoPlaca: string;

  @Column({ name: 'licencia_url', type: 'varchar', nullable: true })
  licenciaUrl: string;

  @Column({ name: 'seguro_url', type: 'varchar', nullable: true })
  seguroUrl: string;

  @Column({ type: 'varchar', default: EstadosConductor.PENDIENTE })
  estadoAprobacion: string;

  @Column({ type: 'varchar', default: EstadosDisponibilidadConductor.DESCONECTADO })
  estadoDisponibilidad: string;

  @Column({ type: 'float', nullable: true })
  ultimaUbicacionLat: number;

  @Column({ type: 'float', nullable: true })
  ultimaUbicacionLng: number;
}
