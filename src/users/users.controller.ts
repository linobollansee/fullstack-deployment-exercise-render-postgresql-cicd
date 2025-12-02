// Import decorators and utilities from NestJS
// Dekoratoren und Utilities von NestJS importieren
import {
  Controller, // Marks class as a controller / Markiert Klasse als Controller
  Get, // HTTP GET method decorator / HTTP GET-Methoden-Dekorator
  Post, // HTTP POST method decorator / HTTP POST-Methoden-Dekorator
  Put, // HTTP PUT method decorator / HTTP PUT-Methoden-Dekorator
  Delete, // HTTP DELETE method decorator / HTTP DELETE-Methoden-Dekorator
  Body, // Extracts request body / Extrahiert Request-Body
  Param, // Extracts URL parameter / Extrahiert URL-Parameter
  Query, // Extracts query parameter / Extrahiert Query-Parameter
  ParseIntPipe, // Converts string to number / Konvertiert String in Zahl
} from "@nestjs/common";

// Import UsersService - contains the business logic
// UsersService importieren - enthält die Geschäftslogik
import { UsersService } from "./users.service";

// Import DTOs - define the shape of incoming data
// DTOs importieren - definieren die Form der eingehenden Daten
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

// Import User entity - defines the user structure
// User-Entity importieren - definiert die Benutzer-Struktur
import { User } from "./entities/user.entity";

// @Controller decorator - defines the base route "/users"
// @Controller-Dekorator - definiert die Basis-Route "/users"
@Controller("users")
export class UsersController {
  // Constructor - inject UsersService dependency
  // Konstruktor - UsersService-Abhängigkeit injizieren
  constructor(private readonly usersService: UsersService) {}

  // @Get() - handles GET requests to /users
  // @Get() - behandelt GET-Anfragen an /users
  @Get()
  async findAll(
    // @Query - extracts optional limit parameter from URL
    // @Query - extrahiert optionalen Limit-Parameter aus URL
    @Query("limit") limit?: number // e.g., /users?limit=10
  ): Promise<User[]> {
    // Returns array of users / Gibt Array von Benutzern zurück
    // Call service to fetch all users with optional limit
    // Service aufrufen, um alle Benutzer mit optionalem Limit abzurufen
    return this.usersService.findAll(limit);
  }

  // @Get(":id") - handles GET requests to /users/1, /users/2, etc.
  // @Get(":id") - behandelt GET-Anfragen an /users/1, /users/2, usw.
  @Get(":id")
  async findOne(
    // @Param - extracts :id from URL and converts to number
    // @Param - extrahiert :id aus URL und konvertiert in Zahl
    @Param("id", ParseIntPipe) id: number
  ): Promise<User> {
    // Returns single user / Gibt einzelnen Benutzer zurück
    // Call service to fetch one user by ID
    // Service aufrufen, um einen Benutzer nach ID abzurufen
    return this.usersService.findOne(id);
  }

  // @Post() - handles POST requests to /users (create new user)
  // @Post() - behandelt POST-Anfragen an /users (neuen Benutzer erstellen)
  @Post()
  async create(
    // @Body - extracts and validates request body data
    // @Body - extrahiert und validiert Request-Body-Daten
    @Body() createUserDto: CreateUserDto
  ): Promise<User> {
    // Returns created user / Gibt erstellten Benutzer zurück
    // Call service to create a new user
    // Service aufrufen, um einen neuen Benutzer zu erstellen
    return this.usersService.create(createUserDto);
  }

  // @Put(":id") - handles PUT requests to /users/1 (update existing user)
  // @Put(":id") - behandelt PUT-Anfragen an /users/1 (vorhandenen Benutzer aktualisieren)
  @Put(":id")
  async update(
    // @Param - extracts :id from URL
    // @Param - extrahiert :id aus URL
    @Param("id", ParseIntPipe) id: number,
    // @Body - extracts update data from request
    // @Body - extrahiert Update-Daten aus Anfrage
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    // Returns updated user / Gibt aktualisierten Benutzer zurück
    // Call service to update the user
    // Service aufrufen, um den Benutzer zu aktualisieren
    return this.usersService.update(id, updateUserDto);
  }

  // @Delete(":id") - handles DELETE requests to /users/1 (delete user)
  // @Delete(":id") - behandelt DELETE-Anfragen an /users/1 (Benutzer löschen)
  @Delete(":id")
  async remove(
    // @Param - extracts :id from URL
    // @Param - extrahiert :id aus URL
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    // Returns nothing / Gibt nichts zurück
    // Call service to delete the user
    // Service aufrufen, um den Benutzer zu löschen
    return this.usersService.remove(id);
  }
}
