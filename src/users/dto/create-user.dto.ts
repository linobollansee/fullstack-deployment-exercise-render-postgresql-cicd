// Import validation decorators from class-validator
// Validierungs-Dekoratoren von class-validator importieren
import { IsEmail, IsString, MinLength } from "class-validator";

// DTO (Data Transfer Object) - defines the shape of data for creating a user
// DTO (Data Transfer Object) - definiert die Form der Daten zum Erstellen eines Benutzers
export class CreateUserDto {
  // @IsEmail - validates that the value is a valid email format
  // @IsEmail - validiert, dass der Wert ein gültiges E-Mail-Format hat
  @IsEmail()
  email: string;

  // @IsString - ensures the value is a string type
  // @IsString - stellt sicher, dass der Wert ein String-Typ ist
  @IsString()

  // @MinLength(6) - password must be at least 6 characters long
  // @MinLength(6) - Passwort muss mindestens 6 Zeichen lang sein
  @MinLength(6)
  password: string;
}
