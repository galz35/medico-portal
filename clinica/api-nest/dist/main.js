"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const fs_1 = require("fs");
const app_module_1 = require("./app.module");
const global_error_filter_1 = require("./common/filters/global-error.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    await app.register(require('@fastify/cookie'), {
        secret: process.env.COOKIE_SECRET || 'secret-ultra-seguro-portal',
    });
    const microserviceOptions = {
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'medico',
            protoPath: (0, path_1.join)(__dirname, '..', 'proto', 'medico.proto'),
            url: '127.0.0.1:50051',
        },
    };
    const distProto = (0, path_1.join)(__dirname, 'medico.proto');
    if ((0, fs_1.existsSync)(distProto)) {
        microserviceOptions.options.protoPath = distProto;
    }
    app.connectMicroservice(microserviceOptions);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Medico API')
        .setDescription('The Medico API using Fastify and gRPC')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new global_error_filter_1.GlobalErrorFilter());
    app.setGlobalPrefix('api');
    await app.startAllMicroservices();
    const port = process.env.PORT ?? process.env.API_PORT ?? 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 API REST corriendo en puerto ${port}`);
    console.log(`🔌 gRPC corriendo en 127.0.0.1:50051`);
}
bootstrap();
//# sourceMappingURL=main.js.map