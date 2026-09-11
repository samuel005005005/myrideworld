import { Entity, PrimaryColumn, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { EstadosTarifa } from '../../../../../compartidos/constantes/estados-tarifa.enum.js';

@Entity('tarifas')
export class TarifaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  origen: string;

  @Column({ type: 'varchar' })
  destino: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'varchar', default: EstadosTarifa.ACTIVO })
  estado: string;
}
