// Import Module decorator - marks this class as a NestJS module
// Module-Dekorator importieren - markiert diese Klasse als NestJS-Modul
import { Module } from "@nestjs/common";

// Import ConfigModule - loads environment variables from .env file
// ConfigModule importieren - lädt Umgebungsvariablen aus .env-Datei
import { ConfigModule } from "@nestjs/config";

// Import TypeOrmModule - provides database functionality
// TypeOrmModule importieren - stellt Datenbankfunktionalität bereit
import { TypeOrmModule } from "@nestjs/typeorm";

// Import ServeStaticModule - serves static files
// ServeStaticModule importieren - stellt statische Dateien bereit
import { ServeStaticModule } from "@nestjs/serve-static";

// Import join function to create file paths
// join-Funktion zum Erstellen von Dateipfaden importieren
import { join } from "path";

// Import QuotesModule - handles all quote-related functionality
// QuotesModule importieren - behandelt alle zitatbezogenen Funktionen
import { QuotesModule } from "./quotes/quotes.module";

// Import UsersModule - handles all user-related functionality
// UsersModule importieren - behandelt alle benutzerbezogenen Funktionen
import { UsersModule } from "./users/users.module";

// Import Quote entity - represents the database table structure
// Quote-Entity importieren - repräsentiert die Datenbanktabellenstruktur
import { Quote } from "./quotes/entities/quote.entity";

// Import User entity - represents the database table structure
// User-Entity importieren - repräsentiert die Datenbanktabellenstruktur
import { User } from "./users/entities/user.entity";

// @Module decorator - defines a NestJS module with its dependencies
// @Module-Dekorator - definiert ein NestJS-Modul mit seinen Abhängigkeiten
@Module({
  // imports: Array of modules this module depends on
  // imports: Array von Modulen, von denen dieses Modul abhängt
  imports: [
    // Configure ConfigModule to load .env file
    // ConfigModule konfigurieren, um .env-Datei zu laden
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
    }),

    // Configure ServeStaticModule to serve React frontend
    // ServeStaticModule konfigurieren, um React-Frontend bereitzustellen
    ServeStaticModule.forRoot({
      // rootPath: Path to the directory containing static files (React build)
      // rootPath: Pfad zum Verzeichnis mit statischen Dateien (React-Build)
      rootPath: join(__dirname, "..", "frontend", "dist"),
      // serveRoot: Serve frontend from root path
      // serveRoot: Frontend vom Root-Pfad bereitstellen
      serveRoot: "/",
    }),

    // Configure TypeORM database connection
    // TypeORM-Datenbankverbindung konfigurieren
    TypeOrmModule.forRoot({
      // type: Database type - using PostgreSQL
      // type: Datenbanktyp - verwendet PostgreSQL
      type: "postgres",

      // url: Database connection string from environment variable
      // url: Datenbank-Verbindungszeichenfolge aus Umgebungsvariable
      url: process.env.DATABASE_URL,

      // ssl: SSL/TLS configuration for secure database connection
      // ssl: SSL/TLS-Konfiguration für sichere Datenbankverbindung
      ssl: {
        // rejectUnauthorized: Accept self-signed certificates (needed for some cloud providers)
        // rejectUnauthorized: Selbstsignierte Zertifikate akzeptieren (erforderlich für einige Cloud-Anbieter)
        rejectUnauthorized: false,
      },

      // extra: Additional driver-specific connection options
      // extra: Zusätzliche treiberspezifische Verbindungsoptionen
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },

      // entities: List of entities (database tables) to use
      // entities: Liste der zu verwendenden Entities (Datenbanktabellen)
      entities: [Quote, User],

      // synchronize: Auto-create tables from entities (only for development!)
      // synchronize: Tabellen automatisch aus Entities erstellen (nur für Entwicklung!)
      synchronize: true,
    }),

    // Import QuotesModule for quote functionality
    // QuotesModule für Zitat-Funktionalität importieren
    QuotesModule,

    // Import UsersModule for user functionality
    // UsersModule für Benutzer-Funktionalität importieren
    UsersModule,
  ],
})
// AppModule - The root module of the application
// AppModule - Das Hauptmodul der Anwendung
export class AppModule {}
