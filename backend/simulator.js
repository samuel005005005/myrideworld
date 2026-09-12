import { io } from 'socket.io-client';
import axios from 'axios';

async function simulate() {
  const viajeId = process.argv[2];
  if (!viajeId) {
    console.error('Usage: node simulator.js <viaje_id>');
    process.exit(1);
  }

  try {
    // 1. Login as conductor to get JWT
    console.log('Iniciando sesión como conductor...');
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'conductor@myride.com',
      password: '12345678',
      rol: 'CONDUCTOR'
    });

    const token = response.data.token;
    console.log('Login exitoso. Conectando a sockets...');

    // 2. Connect to WebSocket
    const socket = io('http://localhost:3000', {
      auth: { token },
      transports: ['websocket']
    });

    socket.on('connect', () => {
      console.log('Conductor conectado al WebSocket.');

      // Start moving towards a fake destination (e.g. from Punta Cana Airport towards some hotel)
      // We will interpolate 50 steps from start to end
      let startLat = 18.5820;
      let startLng = -68.3971;
      let targetLat = 18.5674;
      let targetLng = -68.3634;
      let step = 0;
      const totalSteps = 100;

      setInterval(() => {
        if (step > totalSteps) {
          console.log('Simulación completada.');
          process.exit(0);
        }

        const currentLat = startLat + ((targetLat - startLat) * (step / totalSteps));
        const currentLng = startLng + ((targetLng - startLng) * (step / totalSteps));

        console.log(`Emitiendo ubicación: ${currentLat}, ${currentLng}`);
        socket.emit('actualizarUbicacion', {
          viajeId: viajeId,
          lat: currentLat,
          lng: currentLng
        });

        step++;
      }, 1000);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado.');
    });

  } catch (e) {
    console.error('Error:', e.response?.data || e.message);
  }
}

simulate();
