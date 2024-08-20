import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { SchemasModule } from 'src/schemas/schemas.module';

@Module({
  imports: [SchemasModule],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
