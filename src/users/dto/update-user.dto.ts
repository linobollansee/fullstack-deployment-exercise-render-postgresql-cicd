// Import validation decorators from class-validator
// Validierungs-Dekoratoren von class-validator importieren
import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

// DTO (Data Transfer Object) - defines the shape of data for updating a user
// DTO (Data Transfer Object) - definiert die Form der Daten zum Aktualisieren eines Benutzers
export class UpdateUserDto {
  // @IsEmail - validates that the value is a valid email format if provided
  // @IsEmail - validiert, dass der Wert ein gültiges E-Mail-Format hat, falls angegeben
  @IsEmail()

  // @IsOptional - field can be omitted (not required)
  // @IsOptional - Feld kann weggelassen werden (nicht erforderlich)
  @IsOptional()
  email?: string; // ? means optional in TypeScript / ? bedeutet optional in TypeScript

  // @IsString - ensures the value is a string type if provided
  // @IsString - stellt sicher, dass der Wert ein String-Typ ist, falls angegeben
  @IsString()

  // @MinLength(6) - password must be at least 6 characters long if provided
  // @MinLength(6) - Passwort muss mindestens 6 Zeichen lang sein, falls angegeben
  @MinLength(6)

  // @IsOptional - field can be omitted (not required)
  // @IsOptional - Feld kann weggelassen werden (nicht erforderlich)
  @IsOptional()
  password?: string; // ? means optional in TypeScript / ? bedeutet optional in TypeScript
}
