import { ApiProperty } from '@nestjs/swagger';

export class ConfiguracionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  clave!: string;

  @ApiProperty()
  valor!: string;

  @ApiProperty()
  descripcion!: string;

  @ApiProperty()
  actualizadoEn!: Date;
}
