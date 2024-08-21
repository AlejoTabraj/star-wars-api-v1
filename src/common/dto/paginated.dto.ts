import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : 1), { toClassOnly: true })
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : 10), { toClassOnly: true })
  pageSize: number;

  @IsOptional()
  @IsString()
  name?: string;
}
