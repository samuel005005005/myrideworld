import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { DetalleEjecucionOrmEntity } from './detalle-ejecucion.orm-entity.js';

@Entity('ejecucion_proceso')
export class EjecucionProcesoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  proceso: string;

  @Column({ length: 10, default: 'PE' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_inicio' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp', nullable: true })
  fechaFin: Date | null;

  @Column({ name: 'total_registros', default: 0 })
  totalRegistros: number;

  @Column({ name: 'registros_procesados', default: 0 })
  registrosProcesados: number;

  @Column({ name: 'registros_error', default: 0 })
  registrosError: number;

  @Column('text', { nullable: true })
  detalle: string | null;

  @Column({ length: 100 })
  usuario: string;

  @OneToMany(() => DetalleEjecucionOrmEntity, (detalle) => detalle.ejecucionProceso)
  detalles: DetalleEjecucionOrmEntity[];
}
