import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { FilmsService } from './films.service';
import { QueryDto } from '../common/dto/paginated.dto';
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) { }


  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findPaginated(
    @Query() query: QueryDto
  ) {
    return this.filmsService.findPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }

}
