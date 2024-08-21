import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { QueryDto } from 'src/common/dto/paginated.dto';

@Controller('starships')
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService) { }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findPaginated(
    @Query() query: QueryDto
  ) {
    return this.starshipsService.findPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.starshipsService.findOne(id);
  }

}
