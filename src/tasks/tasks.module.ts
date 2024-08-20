import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { HttpModule } from '@nestjs/axios';
import { SchemasModule } from 'src/schemas/schemas.module';

@Module({
    imports: [HttpModule, SchemasModule],
    providers: [TasksService],
    exports: [TasksService]
})
export class TasksModule {}
