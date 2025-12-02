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

// Import QuotesService - contains the business logic
// QuotesService importieren - enthält die Geschäftslogik
import { QuotesService } from "./quotes.service";

// Import DTOs - define the shape of incoming data
// DTOs importieren - definieren die Form der eingehenden Daten
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";

// Import Quote entity - defines the quote structure
// Quote-Entity importieren - definiert die Zitat-Struktur
import { Quote } from "./entities/quote.entity";

// @Controller decorator - defines the base route "/quotes"
// @Controller-Dekorator - definiert die Basis-Route "/quotes"
@Controller("quotes")
export class QuotesController {
  // Constructor - inject QuotesService dependency
  // Konstruktor - QuotesService-Abhängigkeit injizieren
  constructor(private readonly quotesService: QuotesService) {}

  // @Get() - handles GET requests to /quotes
  // @Get() - behandelt GET-Anfragen an /quotes
  @Get()
  async findAll(
    // @Query - extracts optional query parameters from URL
    // @Query - extrahiert optionale Query-Parameter aus URL
    @Query("limit") limit?: number, // e.g., /quotes?limit=5
    @Query("author") author?: string // e.g., /quotes?author=Oscar
  ): Promise<Quote[]> {
    // Returns array of quotes / Gibt Array von Zitaten zurück
    // Call service to fetch all quotes with filters
    // Service aufrufen, um alle Zitate mit Filtern abzurufen
    return this.quotesService.findAll(limit, author);
  }

  // @Get(":id") - handles GET requests to /quotes/1, /quotes/2, etc.
  // @Get(":id") - behandelt GET-Anfragen an /quotes/1, /quotes/2, usw.
  @Get(":id")
  async findOne(
    // @Param - extracts :id from URL and converts to number
    // @Param - extrahiert :id aus URL und konvertiert in Zahl
    @Param("id", ParseIntPipe) id: number
  ): Promise<Quote> {
    // Returns single quote / Gibt einzelnes Zitat zurück
    // Call service to fetch one quote by ID
    // Service aufrufen, um ein Zitat nach ID abzurufen
    return this.quotesService.findOne(id);
  }

  // @Post() - handles POST requests to /quotes (create new quote)
  // @Post() - behandelt POST-Anfragen an /quotes (neues Zitat erstellen)
  @Post()
  async create(
    // @Body - extracts and validates request body data
    // @Body - extrahiert und validiert Request-Body-Daten
    @Body() createQuoteDto: CreateQuoteDto
  ): Promise<Quote> {
    // Returns created quote / Gibt erstelltes Zitat zurück
    // Call service to create a new quote
    // Service aufrufen, um ein neues Zitat zu erstellen
    return this.quotesService.create(createQuoteDto);
  }

  // @Put(":id") - handles PUT requests to /quotes/1 (update existing quote)
  // @Put(":id") - behandelt PUT-Anfragen an /quotes/1 (vorhandenes Zitat aktualisieren)
  @Put(":id")
  async update(
    // @Param - extracts :id from URL
    // @Param - extrahiert :id aus URL
    @Param("id", ParseIntPipe) id: number,
    // @Body - extracts update data from request
    // @Body - extrahiert Update-Daten aus Anfrage
    @Body() updateQuoteDto: UpdateQuoteDto
  ): Promise<Quote> {
    // Returns updated quote / Gibt aktualisiertes Zitat zurück
    // Call service to update the quote
    // Service aufrufen, um das Zitat zu aktualisieren
    return this.quotesService.update(id, updateQuoteDto);
  }

  // @Delete(":id") - handles DELETE requests to /quotes/1 (delete quote)
  // @Delete(":id") - behandelt DELETE-Anfragen an /quotes/1 (Zitat löschen)
  @Delete(":id")
  async remove(
    // @Param - extracts :id from URL
    // @Param - extrahiert :id aus URL
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    // Returns nothing / Gibt nichts zurück
    // Call service to delete the quote
    // Service aufrufen, um das Zitat zu löschen
    return this.quotesService.remove(id);
  }
}
