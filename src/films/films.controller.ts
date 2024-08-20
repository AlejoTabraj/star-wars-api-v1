import { Controller, Get, Param, Query } from '@nestjs/common';
import { FilmsService } from './films.service';
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

 
  @Get()
  findPaginated(
    @Query() query: any
  ) {
    return this.filmsService.findPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }

}
