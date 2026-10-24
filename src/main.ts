import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

function formatValidationErrors(
  errors: ValidationError[],
  parentProperty = '',
): { property: string; message: string }[] {
  return errors.flatMap(({ property, constraints, children }) => {
    const fullProperty = parentProperty
      ? `${parentProperty}.${property}`
      : property;
    const messages = Object.values(constraints ?? {}).map((message) => ({
      property: fullProperty,
      message,
    }));

    return [
      ...messages,
      ...formatValidationErrors(children ?? [], fullProperty),
    ];
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.useGlobalInterceptors(app.get(ResponseInterceptor));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) =>
        new BadRequestException(formatValidationErrors(errors)),
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
