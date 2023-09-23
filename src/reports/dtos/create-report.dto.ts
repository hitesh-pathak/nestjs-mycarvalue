import { 
  IsString,
  IsNumber,
  Min,
  Max,
  IsLatitude,
  IsLongitude,
 } from "class-validator";

export class CreateReportDto {

  @IsString()
  make: string;

  @IsString()
  model: string;

  @Min(1930)
  @Max(2050)
  @IsNumber()
  year: number;

  @Min(0)
  @Max(1000000)
  @IsNumber()
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @Min(0)
  @Max(1000000)
  @IsNumber()
  price: number;
}