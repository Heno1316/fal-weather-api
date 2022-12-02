import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const rawBodyBuffer = (req, res, buf, encoding) => {
        if (buf && buf.length) {
            req.rawBody = buf.toString(encoding || 'utf8');
        }
    };
    app.use(json({ verify: rawBodyBuffer }));
    app.use(urlencoded({ extended: true, verify: rawBodyBuffer }));
    app.use(helmet());
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(app.get(ConfigService).get('port'));
}
bootstrap();
