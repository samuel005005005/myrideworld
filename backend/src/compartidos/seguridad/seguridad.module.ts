import { Module } from '@nestjs/common';
import { BcryptHasheadorPassword } from './bcrypt-hasheador-password.adapter.js';
import { HASHEADOR_PASSWORD } from './hasheador-password.port.js';

@Module({
  providers: [
    {
      provide: HASHEADOR_PASSWORD,
      useClass: BcryptHasheadorPassword,
    },
  ],
  exports: [HASHEADOR_PASSWORD],
})
export class SeguridadModule {}
