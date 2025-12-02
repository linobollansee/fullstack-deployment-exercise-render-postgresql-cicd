// Import validation decorators from class-validator
// Validierungs-Dekoratoren von class-validator importieren
import { IsString, IsNotEmpty } from "class-validator";

// DTO (Data Transfer Object) - defines the shape of data for creating a quote
// DTO (Data Transfer Object) - definiert die Form der Daten zum Erstellen eines Zitats
export class CreateQuoteDto {
  // @IsString - ensures the value is a string type
  // @IsString - stellt sicher, dass der Wert ein String-Typ ist
  @IsString()

  // @IsNotEmpty - ensures the field is not empty
  // @IsNotEmpty - stellt sicher, dass das Feld nicht leer ist
  @IsNotEmpty()
  text: string;

  // @IsString - ensures the value is a string type
  // @IsString - stellt sicher, dass der Wert ein String-Typ ist
  @IsString()

  // @IsNotEmpty - ensures the field is not empty
  // @IsNotEmpty - stellt sicher, dass das Feld nicht leer ist
  @IsNotEmpty()
  author: string;
}
