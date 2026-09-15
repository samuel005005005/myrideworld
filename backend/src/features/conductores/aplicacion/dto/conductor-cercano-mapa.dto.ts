import { ApiProperty } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const S = MENSAJES.SWAGGER.COMUNES;
const V = MENSAJES.SWAGGER.VIAJES;

export class ConductorCercanoMapaDto {
  @ApiProperty({ example: S.EJEMPLO_UUID })
  id!: string;

  @ApiProperty({ example: V.EJEMPLO_LATITUD_ORIGEN })
  lat!: number;

  @ApiProperty({ example: V.EJEMPLO_LONGITUD_ORIGEN })
  lng!: number;

  @ApiProperty({ example: MENSAJES.SWAGGER.CONDUCTORES.EJEMPLO_COLOR })
  vehiculoColor!: string;
}
