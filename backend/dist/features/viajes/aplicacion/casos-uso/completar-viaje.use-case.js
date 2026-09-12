var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable } from '@nestjs/common';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { GenerarPagoUseCase } from '../../../pagos-balances/aplicacion/casos-uso/generar-pago.use-case.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { RegistrarBitacoraUseCase } from '../../../bitacora/aplicacion/casos-uso/registrar-bitacora.use-case.js';
import { TiposBitacora } from '../../../../compartidos/constantes/tipos-bitacora.enum.js';
import { ServiciosSistema } from '../../../../compartidos/constantes/servicios-sistema.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
let CompletarViajeUseCase = class CompletarViajeUseCase {
    viajeRepository;
    notificadorViaje;
    generarPagoUseCase;
    registrarBitacora;
    constructor(viajeRepository, notificadorViaje, generarPagoUseCase, registrarBitacora) {
        this.viajeRepository = viajeRepository;
        this.notificadorViaje = notificadorViaje;
        this.generarPagoUseCase = generarPagoUseCase;
        this.registrarBitacora = registrarBitacora;
    }
    async ejecutar(id) {
        const viaje = await this.viajeRepository.obtenerPorId(id);
        if (!viaje) {
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
        }
        viaje.completarViaje();
        const guardado = await this.viajeRepository.guardar(viaje);
        if (viaje.conductorId) {
            await this.generarPagoUseCase.ejecutar({
                viajeId: viaje.id,
                conductorId: viaje.conductorId,
                montoTotal: viaje.tarifaEstimada,
            });
        }
        await this.registrarBitacora.ejecutar({
            tipoEvento: TiposBitacora.INFO,
            servicioSistema: ServiciosSistema.VIAJES,
            detalle: `${MENSAJES.EXCEPCIONES.VIAJES.COMPLETADO_EXITOSO}: ${viaje.id}`,
            usuario: `conductor-${viaje.conductorId}`,
            entidadId: viaje.id,
            accion: 'COMPLETAR_VIAJE',
            request: { viajeId: id },
        });
        this.notificadorViaje.notificarViajeCompletado(guardado.id, Number(guardado.tarifaEstimada));
        return guardado;
    }
};
CompletarViajeUseCase = __decorate([
    Injectable(),
    __param(0, Inject(VIAJE_REPOSITORY)),
    __param(1, Inject(NOTIFICADOR_VIAJE)),
    __metadata("design:paramtypes", [Object, Object, GenerarPagoUseCase,
        RegistrarBitacoraUseCase])
], CompletarViajeUseCase);
export { CompletarViajeUseCase };
//# sourceMappingURL=completar-viaje.use-case.js.map