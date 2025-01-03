"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const cli_documentation_module_1 = require("./cli-documentation/cli-documentation.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        },
    });
    const cliDocumentationConfig = new swagger_1.DocumentBuilder()
        .setTitle('APIs cli documentation')
        .setDescription('The APIs for cli documentation')
        .setVersion('1.0')
        .build();
    const cliDocumentationDocumentFactory = () => swagger_1.SwaggerModule.createDocument(app, cliDocumentationConfig, {
        include: [cli_documentation_module_1.CliDocumentationModule],
    });
    swagger_1.SwaggerModule.setup('api', app, cliDocumentationDocumentFactory);
    await app.listen(app_module_1.AppModule.RUNNIN_PORT, app_module_1.AppModule.serverIP);
}
bootstrap();
//# sourceMappingURL=main.js.map