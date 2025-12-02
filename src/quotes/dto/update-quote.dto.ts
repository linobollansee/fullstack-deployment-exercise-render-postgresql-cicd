// Import validation decorators from class-validator
// Validierungs-Dekoratoren von class-validator importieren
import { IsString, IsOptional } from "class-validator";

// DTO (Data Transfer Object) - defines the shape of data for updating a quote
// DTO (Data Transfer Object) - definiert die Form der Daten zum Aktualisieren eines Zitats
export class UpdateQuoteDto {
  // @IsString - ensures the value is a string type if provided
  // @IsString - stellt sicher, dass der Wert ein String-Typ ist, falls angegeben
  @IsString()

  // @IsOptional - field can be omitted (not required)
  // @IsOptional - Feld kann weggelassen werden (nicht erforderlich)
  @IsOptional()
  text?: string; // ? means optional in TypeScript / ? bedeutet optional in TypeScript

  // @IsString - ensures the value is a string type if provided
  // @IsString - stellt sicher, dass der Wert ein String-Typ ist, falls angegeben
  @IsString()

  // @IsOptional - field can be omitted (not required)
  // @IsOptional - Feld kann weggelassen werden (nicht erforderlich)
  @IsOptional()
  author?: string; // ? means optional in TypeScript / ? bedeutet optional in TypeScript
}
