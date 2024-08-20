import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PeopleModule } from './people/people.module';
import { StarshipsModule } from './starships/starships.module';
import { FilmsModule } from './films/films.module';
import { PlanetsModule } from './planets/planets.module';
import { TasksService } from './tasks/tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { HttpModule } from '@nestjs/axios';
import { SchemasModule } from './schemas/schemas.module';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './common/winston.config.service';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  WinstonModule.forRootAsync({
    useClass: WinstonConfigService,
  }),
  HttpModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async () => ({}),
    inject: [ConfigService],
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
      useFactory: async (configService) => {
        const uri = configService.get('MONGO_URI')
        return {
          uri,
        };
      },
      inject: [ConfigService],
  }),
  ScheduleModule.forRoot(),
  PeopleModule,
  StarshipsModule,
  FilmsModule,
  PlanetsModule,
  TasksModule,
  SchemasModule,
  ],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule { }
