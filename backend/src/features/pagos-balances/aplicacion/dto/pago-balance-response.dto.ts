import { ApiProperty } from '@nestjs/swagger';

export class PagoBalanceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  viajeId!: string;

  @ApiProperty()
  conductorId!: string;

  @ApiProperty()
  montoBruto!: number;

  @ApiProperty()
  feeProcesamiento!: number;

  @ApiProperty()
  montoNeto!: number;

  @ApiProperty()
  metodo!: string;

  @ApiProperty()
  fecha!: Date;
}
