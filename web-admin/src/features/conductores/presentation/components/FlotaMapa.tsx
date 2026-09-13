import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ConductorListItem } from '../../domain/conductor-list-item';

const CENTRO_PUNTA_CANA: L.LatLngExpression = [18.62, -68.42];

const ICONO_CONECTADO = L.divIcon({
  className: 'flota-marker flota-marker--conectado',
  html: '<span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const ICONO_OCUPADO = L.divIcon({
  className: 'flota-marker flota-marker--ocupado',
  html: '<span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const ICONO_OTRO = L.divIcon({
  className: 'flota-marker flota-marker--otro',
  html: '<span></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function iconoPorDisponibilidad(estado: string): L.DivIcon {
  if (estado === 'Conectado') return ICONO_CONECTADO;
  if (estado === 'Ocupado') return ICONO_OCUPADO;
  return ICONO_OTRO;
}

function tieneGps(c: ConductorListItem): boolean {
  return (
    typeof c.ultimaUbicacionLat === 'number' &&
    typeof c.ultimaUbicacionLng === 'number' &&
    Number.isFinite(c.ultimaUbicacionLat) &&
    Number.isFinite(c.ultimaUbicacionLng)
  );
}

interface FlotaMapaProps {
  conductores: readonly ConductorListItem[];
  seleccionadoId?: string | null;
  onSeleccionar?: (id: string) => void;
}

export function FlotaMapa({
  conductores,
  seleccionadoId,
  onSeleccionar,
}: FlotaMapaProps) {
  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const mapaRef = useRef<L.Map | null>(null);
  const capaRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!contenedorRef.current || mapaRef.current) {
      return;
    }

    const mapa = L.map(contenedorRef.current, {
      center: CENTRO_PUNTA_CANA,
      zoom: 11,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(mapa);

    capaRef.current = L.layerGroup().addTo(mapa);
    mapaRef.current = mapa;

    return () => {
      mapa.remove();
      mapaRef.current = null;
      capaRef.current = null;
    };
  }, []);

  useEffect(() => {
    const mapa = mapaRef.current;
    const capa = capaRef.current;
    if (!mapa || !capa) {
      return;
    }

    capa.clearLayers();
    const conGps = conductores.filter(tieneGps);
    const bounds: L.LatLngExpression[] = [];

    for (const c of conGps) {
      const lat = c.ultimaUbicacionLat as number;
      const lng = c.ultimaUbicacionLng as number;
      const marker = L.marker([lat, lng], {
        icon: iconoPorDisponibilidad(c.estadoDisponibilidad),
        title: c.nombreCompleto,
      });

      const vehiculo = [c.vehiculoColor, c.vehiculoMarca, c.vehiculoModelo]
        .filter(Boolean)
        .join(' ');

      marker.bindPopup(
        `<strong>${c.nombreCompleto}</strong><br/>` +
          `${c.estadoDisponibilidad} · ${c.estadoAprobacion}<br/>` +
          `${vehiculo || 'Sin vehículo'} · ${c.vehiculoPlaca ?? '—'}<br/>` +
          `<a href="tel:${c.telefono}">${c.telefono}</a>`,
      );

      marker.on('click', () => onSeleccionar?.(c.id));
      if (seleccionadoId === c.id) {
        marker.openPopup();
      }
      marker.addTo(capa);
      bounds.push([lat, lng]);
    }

    if (bounds.length > 1) {
      mapa.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 13 });
    } else if (bounds.length === 1) {
      mapa.setView(bounds[0], 13);
    }

    // Leaflet necesita invalidar tamaño tras layout
    setTimeout(() => mapa.invalidateSize(), 50);
  }, [conductores, seleccionadoId, onSeleccionar]);

  const conGps = conductores.filter(tieneGps).length;
  const sinGps = conductores.length - conGps;

  return (
    <div className="flota-mapa-wrap">
      <div className="flota-mapa-legend">
        <span className="legend-dot legend-conectado" /> Conectado
        <span className="legend-dot legend-ocupado" /> Ocupado
        <span className="legend-dot legend-otro" /> Otro / desconectado
        <span className="muted">
          · {conGps} en mapa{sinGps > 0 ? ` · ${sinGps} sin GPS` : ''}
        </span>
      </div>
      <div ref={contenedorRef} className="flota-mapa" />
    </div>
  );
}
