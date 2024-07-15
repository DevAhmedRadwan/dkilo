import { Transform } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class CreateConversionDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  scanId: number;

  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  conversionCount: number;
}
