import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CliDocumentationModule } from './cli-documentation/cli-documentation.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    },
  });

  const cliDocumentationConfig = new DocumentBuilder()
    .setTitle('APIs cli documentation')
    .setDescription('The APIs for cli documentation')
    .setVersion('1.0')
    .build();
  const cliDocumentationDocumentFactory = () =>
    SwaggerModule.createDocument(app, cliDocumentationConfig, {
      include: [CliDocumentationModule],
    });
  SwaggerModule.setup('api', app, cliDocumentationDocumentFactory);

  await app.listen(AppModule.RUNNIN_PORT, AppModule.serverIP);
}
bootstrap();
