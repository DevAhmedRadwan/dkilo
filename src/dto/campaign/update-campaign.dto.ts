import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateCampaignDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description: string;
}
