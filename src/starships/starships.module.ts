import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsController } from './starships.controller';
import { SchemasModule } from 'src/schemas/schemas.module';

@Module({
  imports: [SchemasModule],
  controllers: [StarshipsController],
  providers: [StarshipsService],
  exports: [StarshipsService]
})
export class StarshipsModule {}
