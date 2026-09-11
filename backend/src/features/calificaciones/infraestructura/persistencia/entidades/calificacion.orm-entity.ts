import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('calificaciones')
export class CalificacionOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'viaje_id', type: 'uuid', unique: true })
  viajeId: string;

  @Column({ name: 'pasajero_id', type: 'uuid' })
  pasajeroId: string;

  @Column({ name: 'conductor_id', type: 'uuid' })
  conductorId: string;

  @Column({ type: 'int' })
  puntuacion: number;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @CreateDateColumn()
  fecha: Date;
}
