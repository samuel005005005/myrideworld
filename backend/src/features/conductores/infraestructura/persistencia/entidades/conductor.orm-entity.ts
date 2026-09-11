import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('conductores')
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

  @Column({ type: 'varchar', default: 'Pendiente' })
  estadoAprobacion: string;

  @Column({ type: 'varchar', default: 'Desconectado' })
  estadoDisponibilidad: string;

  @Column({ type: 'float', nullable: true })
  ultimaUbicacionLat: number;

  @Column({ type: 'float', nullable: true })
  ultimaUbicacionLng: number;
}
