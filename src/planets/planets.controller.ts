import { Controller, Get, Param, Query } from '@nestjs/common';

import { PlanetsService } from './planets.service';
@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get()
  findPaginated(
    @Query() query: any
  ) {
    return this.planetsService.findPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planetsService.findOne(id);
  }

}
