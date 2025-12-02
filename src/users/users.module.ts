// Import Module decorator to define a NestJS module
// Module-Dekorator importieren, um ein NestJS-Modul zu definieren
import { Module } from "@nestjs/common";

// Import TypeOrmModule to enable database access for this module
// TypeOrmModule importieren, um Datenbankzugriff für dieses Modul zu aktivieren
import { TypeOrmModule } from "@nestjs/typeorm";

// Import UsersController - handles HTTP requests for users
// UsersController importieren - behandelt HTTP-Anfragen für Benutzer
import { UsersController } from "./users.controller";

// Import UsersService - contains business logic for users
// UsersService importieren - enthält Geschäftslogik für Benutzer
import { UsersService } from "./users.service";

// Import User entity - represents the database table
// User-Entity importieren - repräsentiert die Datenbanktabelle
import { User } from "./entities/user.entity";

// @Module decorator - defines this as a NestJS module
// @Module-Dekorator - definiert dies als NestJS-Modul
@Module({
  // imports: Register the User entity with TypeORM for database operations
  // imports: User-Entity mit TypeORM für Datenbankoperationen registrieren
  imports: [TypeOrmModule.forFeature([User])],

  // controllers: List of controllers in this module (handle HTTP requests)
  // controllers: Liste der Controller in diesem Modul (behandeln HTTP-Anfragen)
  controllers: [UsersController],

  // providers: List of services in this module (contain business logic)
  // providers: Liste der Services in diesem Modul (enthalten Geschäftslogik)
  providers: [UsersService],
})
// UsersModule - organizes all user-related functionality
// UsersModule - organisiert alle benutzerbezogenen Funktionen
export class UsersModule {}
