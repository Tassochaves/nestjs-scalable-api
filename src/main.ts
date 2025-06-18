import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductSlugAlreadyExistsErrorFilter } from './products/filters/product-slug-already-exists.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ProductSlugAlreadyExistsErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
