import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { QueryDto } from 'src/common/dto/paginated.dto';
@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) { }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findPaginated(
    @Query() query: QueryDto
  ) {
    return this.planetsService.findPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planetsService.findOne(id);
  }

}
