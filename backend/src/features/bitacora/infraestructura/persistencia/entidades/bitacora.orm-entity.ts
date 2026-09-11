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
  criterioConsulta: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  request: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  response: Record<string, any> | null;

  @Column({ length: 100 })
  usuario: string;

  @CreateDateColumn()
  fecha: Date;

  @Column({ length: 45, nullable: true })
  ip: string | null;

  @Column({ name: 'entidad_id', length: 100, nullable: true })
  entidadId: string | null;

  @Column({ length: 50 })
  accion: string;

  @Column({ name: 'duracion_ms', nullable: true })
  duracionMs: number | null;
}
