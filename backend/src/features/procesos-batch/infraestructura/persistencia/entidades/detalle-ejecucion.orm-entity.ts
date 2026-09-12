import type { ObjetoJson } from '../../../../../compartidos/tipos/objeto-json.js';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { EjecucionProcesoOrmEntity } from './ejecucion-proceso.orm-entity.js';

@Entity('detalle_ejecucion_proceso')
export class DetalleEjecucionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ejecucion_proceso_id' })
  ejecucionProcesoId: string;

  @ManyToOne('EjecucionProcesoOrmEntity', 'detalles')
  @JoinColumn({ name: 'ejecucion_proceso_id' })
  ejecucionProceso: EjecucionProcesoOrmEntity;

  @Column({ type: 'varchar', name: 'entidad_id', length: 100, nullable: true })
  entidadId: string | null;

  @Column({ length: 10, default: 'PE' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @Column({ name: 'json_generado', type: 'jsonb', nullable: true })
  jsonGenerado: ObjetoJson | null;

  @Column({ name: 'json_respuesta', type: 'jsonb', nullable: true })
  jsonRespuesta: ObjetoJson | null;

  @Column('text', { nullable: true })
  traceback: string | null;

  @Column({ name: 'valor_clave', length: 200 })
  valorClave: string;
}
