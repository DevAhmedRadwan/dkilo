import { IsString, MaxLength } from "class-validator";

export class CreateCampaignDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(255)
  description: string;
}
