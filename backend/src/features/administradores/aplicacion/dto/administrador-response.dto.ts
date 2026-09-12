import { ApiProperty } from '@nestjs/swagger';
import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';

export class AdministradorResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nombreCompleto: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: RolesAdmin })
  rolAdmin: RolesAdmin;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  fechaRegistro: Date;
}
