// Import Module decorator - marks this class as a NestJS module
// Module-Dekorator importieren - markiert diese Klasse als NestJS-Modul
import { Module } from "@nestjs/common";

// Import TypeOrmModule - provides database functionality
// TypeOrmModule importieren - stellt Datenbankfunktionalität bereit
import { TypeOrmModule } from "@nestjs/typeorm";

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
    // Configure TypeORM database connection
    // TypeORM-Datenbankverbindung konfigurieren
    TypeOrmModule.forRoot({
      // type: Database type - using SQLite
      // type: Datenbanktyp - verwendet SQLite
      type: "better-sqlite3",

      // database: Name of the SQLite database file
      // database: Name der SQLite-Datenbankdatei
      database: "quote-api.db",

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
