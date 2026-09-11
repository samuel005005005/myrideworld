import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'varchar', default: 'Activo' })
  estado: string;
}
