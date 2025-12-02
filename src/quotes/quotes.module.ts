// Import Module decorator to define a NestJS module
// Module-Dekorator importieren, um ein NestJS-Modul zu definieren
import { Module } from "@nestjs/common";

// Import TypeOrmModule to enable database access for this module
// TypeOrmModule importieren, um Datenbankzugriff für dieses Modul zu aktivieren
import { TypeOrmModule } from "@nestjs/typeorm";

// Import QuotesController - handles HTTP requests for quotes
// QuotesController importieren - behandelt HTTP-Anfragen für Zitate
import { QuotesController } from "./quotes.controller";

// Import QuotesService - contains business logic for quotes
// QuotesService importieren - enthält Geschäftslogik für Zitate
import { QuotesService } from "./quotes.service";

// Import Quote entity - represents the database table
// Quote-Entity importieren - repräsentiert die Datenbanktabelle
import { Quote } from "./entities/quote.entity";

// @Module decorator - defines this as a NestJS module
// @Module-Dekorator - definiert dies als NestJS-Modul
@Module({
  // imports: Register the Quote entity with TypeORM for database operations
  // imports: Quote-Entity mit TypeORM für Datenbankoperationen registrieren
  imports: [TypeOrmModule.forFeature([Quote])],

  // controllers: List of controllers in this module (handle HTTP requests)
  // controllers: Liste der Controller in diesem Modul (behandeln HTTP-Anfragen)
  controllers: [QuotesController],

  // providers: List of services in this module (contain business logic)
  // providers: Liste der Services in diesem Modul (enthalten Geschäftslogik)
  providers: [QuotesService],
})
// QuotesModule - organizes all quote-related functionality
// QuotesModule - organisiert alle zitatbezogenen Funktionen
export class QuotesModule {}
