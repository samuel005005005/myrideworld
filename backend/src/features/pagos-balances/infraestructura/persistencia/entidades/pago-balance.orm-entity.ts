import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ViajeOrmEntity } from '../../../../viajes/infraestructura/persistencia/entidades/viaje.orm-entity.js';
import { ConductorOrmEntity } from '../../../../conductores/infraestructura/persistencia/entidades/conductor.orm-entity.js';

@Entity('pagos_balances')
export class PagoBalanceOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  viajeId: string;

  @ManyToOne(() => ViajeOrmEntity)
  @JoinColumn({ name: 'viajeId' })
  viaje: ViajeOrmEntity;

  @Column({ type: 'uuid' })
  conductorId: string;

  @ManyToOne(() => ConductorOrmEntity)
  @JoinColumn({ name: 'conductorId' })
  conductor: ConductorOrmEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montoBruto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  feeProcesamiento: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montoNeto: number;

  @Column({ type: 'varchar' })
  metodo: string;

  @CreateDateColumn()
  fecha: Date;
}
