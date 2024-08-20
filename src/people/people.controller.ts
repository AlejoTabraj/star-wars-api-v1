import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  findPaginated(
    @Query() query: any
  ) {
    return this.peopleService.findPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peopleService.findOne(id);
  }

}
