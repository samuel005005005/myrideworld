import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('idempotencia')
export class IdempotenciaOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'llave', unique: true, length: 100 })
  llave: string;

  @Column({ name: 'url' })
  url: string;

  @Column({ name: 'cuerpo_peticion_hash', nullable: true })
  cuerpoPeticionHash?: string;

  @Column({ name: 'respuesta', type: 'jsonb', nullable: true })
  respuesta?: any;

  @Column({ name: 'codigo_estado', type: 'int', nullable: true })
  codigoEstado?: number;

  @Column({ name: 'estado', length: 20 })
  estado: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
