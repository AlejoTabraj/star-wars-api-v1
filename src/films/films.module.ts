import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { SchemasModule } from 'src/schemas/schemas.module';

@Module({
  imports: [SchemasModule],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
