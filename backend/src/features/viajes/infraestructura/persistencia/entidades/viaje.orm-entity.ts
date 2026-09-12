import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { PasajeroOrmEntity } from '../../../../pasajeros/infraestructura/persistencia/entidades/pasajero.orm-entity.js';
import { ConductorOrmEntity } from '../../../../conductores/infraestructura/persistencia/entidades/conductor.orm-entity.js';
import { EstadosViaje } from '../../../../../compartidos/constantes/estados-viaje.enum.js';

@Entity('viajes')
@Index(['estado', 'fechaSolicitud'])
@Index(['pasajeroId'])
@Index(['conductorId'])
export class ViajeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  pasajeroId: string;

  @ManyToOne(() => PasajeroOrmEntity)
  @JoinColumn({ name: 'pasajeroId' })
  pasajero: PasajeroOrmEntity;

  @Column({ type: 'uuid', nullable: true })
  conductorId: string;

  @ManyToOne(() => ConductorOrmEntity, { nullable: true })
  @JoinColumn({ name: 'conductorId' })
  conductor: ConductorOrmEntity;

  @Column({ type: 'float' })
  origenLat: number;

  @Column({ type: 'float' })
  origenLng: number;

  @Column({ type: 'float' })
  destinoLat: number;

  @Column({ type: 'float' })
  destinoLng: number;

  @Column({ type: 'varchar', default: EstadosViaje.SOLICITADO })
  estado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tarifaEstimada: number;

  @Column({ name: 'metodo_pago', type: 'varchar', nullable: true })
  metodoPago: string;

  @Column({ name: 'cancelado_por', type: 'varchar', nullable: true })
  canceladoPor: string;

  @Column({ name: 'motivo_cancelacion', type: 'varchar', nullable: true })
  motivoCancelacion: string;

  @Column({ name: 'fecha_solicitud', type: 'timestamp' })
  fechaSolicitud: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp', nullable: true })
  fechaFin: Date | null;

  @Column({ name: 'conductores_rechazados', type: 'simple-json', default: '[]' })
  conductoresRechazados: string[];
}
