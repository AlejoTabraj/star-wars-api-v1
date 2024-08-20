import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { SchemasModule } from 'src/schemas/schemas.module';

@Module({
  imports: [SchemasModule],
  controllers: [PlanetsController],
  providers: [PlanetsService],
})
export class PlanetsModule {}
