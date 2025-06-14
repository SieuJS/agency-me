import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Agency me example')
    .setDescription('The Agency-me API description')
    .setVersion('1.0')
    .addTag('agency-me')
    .addBearerAuth(
      {
        // I was also testing it without prefix 'Bearer ' before the JWT
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Save Swagger JSON to file
  fs.writeFileSync(path.resolve(__dirname, '../../swagger.json'), JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
