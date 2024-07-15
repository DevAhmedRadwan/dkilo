import { Transform } from "class-transformer";
import { IsInt, IsString, MaxLength, Min } from "class-validator";

export class CreateQRCodeDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  campaignId: number;

  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(255)
  description: string;

  @IsString()
  @MaxLength(255)
  redirectUrl: string;
}
