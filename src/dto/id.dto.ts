import { Transform } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class IdDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  id: number;
}
