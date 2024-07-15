import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateQRCodeDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  redirectUrl: string;
}
