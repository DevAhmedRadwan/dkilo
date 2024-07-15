import { Transform } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class PagenationDto {
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  page: number;

  @IsInt()
  @Min(1)
  @Max(1000)
  @Transform(({ value }) => parseInt(value))
  pageSize: number;
}
