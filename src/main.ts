// Import NestFactory - creates the NestJS application instance
// NestFactory importieren - erstellt die NestJS-Anwendungsinstanz
import { NestFactory } from "@nestjs/core";

// Import ValidationPipe - validates incoming data automatically
// ValidationPipe importieren - validiert eingehende Daten automatisch
import { ValidationPipe } from "@nestjs/common";

// Import the root application module
// Das Hauptanwendungsmodul importieren
import { AppModule } from "./app.module";

// Bootstrap function - starts the application
// Bootstrap-Funktion - startet die Anwendung
async function bootstrap() {
  // Create NestJS application using AppModule
  // NestJS-Anwendung mit AppModule erstellen
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe for all routes
  // Globale Validierungs-Pipe für alle Routen aktivieren
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: Remove properties that are not in the DTO
      // whitelist: Entferne Eigenschaften, die nicht im DTO sind
      whitelist: true,

      // forbidNonWhitelisted: Throw error if extra properties are sent
      // forbidNonWhitelisted: Fehler werfen, wenn zusätzliche Eigenschaften gesendet werden
      forbidNonWhitelisted: true,

      // transform: Automatically convert payloads to DTO instances
      // transform: Payloads automatisch in DTO-Instanzen umwandeln
      transform: true,
    })
  );

  // Start listening on port 3000
  // Auf Port 3000 lauschen
  await app.listen(3000);

  // Log message when server is ready
  // Nachricht ausgeben, wenn Server bereit ist
  console.log("Quote API is running on http://localhost:3000");
}

// Call bootstrap to start the application
// Bootstrap aufrufen, um die Anwendung zu starten
bootstrap();
