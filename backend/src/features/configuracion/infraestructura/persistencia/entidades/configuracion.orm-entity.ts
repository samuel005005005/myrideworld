import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('configuraciones')
export class ConfiguracionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  clave: string;

  @Column()
  valor: string;

  @Column({ default: '' })
  descripcion: string;

  @Column({ type: 'timestamp' })
  actualizadoEn: Date;
}
