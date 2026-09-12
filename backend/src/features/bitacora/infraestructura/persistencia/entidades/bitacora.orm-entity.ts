import type { ObjetoJson } from '../../../../../compartidos/tipos/objeto-json.js';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('bitacora_eventos')
export class BitacoraOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tipo_evento', length: 20 })
  tipoEvento: string;

  @Column({ name: 'servicio_sistema', length: 50 })
  servicioSistema: string;

  @Column('text')
  detalle: string;

  @Column({ name: 'criterio_consulta', type: 'jsonb', nullable: true })
  criterioConsulta: ObjetoJson | null;

  @Column({ type: 'jsonb', nullable: true })
  request: ObjetoJson | null;

  @Column({ type: 'jsonb', nullable: true })
  response: ObjetoJson | null;

  @Column({ length: 100 })
  usuario: string;

  @CreateDateColumn()
  fecha: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip: string | null;

  @Column({ type: 'varchar', name: 'entidad_id', length: 100, nullable: true })
  entidadId: string | null;

  @Column({ type: 'varchar', length: 50 })
  accion: string;

  @Column({ type: 'int', name: 'duracion_ms', nullable: true })
  duracionMs: number | null;
}
