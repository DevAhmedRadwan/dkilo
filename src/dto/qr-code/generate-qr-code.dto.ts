import { Transform } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class GenerateQRCodeDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsInt()
  @Min(30)
  @Max(1000)
  @Transform(({ value }) => parseInt(value))
  width;

  @IsInt()
  @Min(30)
  @Max(1000)
  @Transform(({ value }) => parseInt(value))
  height;
}
