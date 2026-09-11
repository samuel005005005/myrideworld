import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './compartidos/filtros/global-exception.filter.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 0. Seguridad HTTP
  app.use(helmet());

  // 1. Configurar CORS (Para que el frontend web/mobile pueda conectarse)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // 2. Filtro Global de Excepciones (Evita filtrado de stack traces)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 3. Documentación Swagger (Portal Interactivo)
  const config = new DocumentBuilder()
    .setTitle('MyRide MVP API')
    .setDescription('API Core para la plataforma de viajes MyRide (Pasajeros y Conductores)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
