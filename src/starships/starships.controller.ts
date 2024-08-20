import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';

@Controller('starships')
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService) {}

  @Get()
  findPaginated(
    @Query() query: any
  ) {
    return this.starshipsService.findPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.starshipsService.findOne(id);
  }

}
