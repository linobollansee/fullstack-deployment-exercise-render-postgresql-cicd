// Import Injectable decorator - marks this class as a service that can be injected
// Injectable-Dekorator importieren - markiert diese Klasse als injizierbaren Service
import { Injectable, NotFoundException } from "@nestjs/common";

// Import InjectRepository - allows us to inject the database repository
// InjectRepository importieren - ermöglicht Injektion des Datenbank-Repositorys
import { InjectRepository } from "@nestjs/typeorm";

// Import Repository and Like from TypeORM - database operations
// Repository und Like von TypeORM importieren - Datenbankoperationen
import { Repository, Like } from "typeorm";

// Import Quote entity - represents the database table
// Quote-Entity importieren - repräsentiert die Datenbanktabelle
import { Quote } from "./entities/quote.entity";

// Import DTOs - define the shape of incoming data
// DTOs importieren - definieren die Form der eingehenden Daten
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";

// @Injectable - marks this class as a service that can be dependency-injected
// @Injectable - markiert diese Klasse als Service, der dependency-injected werden kann
@Injectable()
export class QuotesService {
  // Constructor - inject the Quote repository for database operations
  // Konstruktor - Quote-Repository für Datenbankoperationen injizieren
  constructor(
    // @InjectRepository - injects the TypeORM repository for Quote entity
    // @InjectRepository - injiziert das TypeORM-Repository für Quote-Entity
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote> // Database access layer / Datenbankzugriffsschicht
  ) {}

  // findAll - retrieves all quotes with optional filtering and limiting
  // findAll - ruft alle Zitate mit optionaler Filterung und Begrenzung ab
  async findAll(limit?: number, author?: string): Promise<Quote[]> {
    // Create a query builder to construct complex database queries
    // Query-Builder erstellen, um komplexe Datenbankabfragen zu konstruieren
    const queryBuilder = this.quotesRepository.createQueryBuilder("quote");

    // Filter by author if provided (case-insensitive search)
    // Nach Autor filtern, falls angegeben (Groß-/Kleinschreibung ignorieren)
    if (author) {
      // LIKE query: %author% means "contains author anywhere in the string"
      // LIKE-Abfrage: %author% bedeutet "enthält author irgendwo im String"
      queryBuilder.where("quote.author LIKE :author", {
        author: `%${author}%`, // e.g., "Oscar" finds "Oscar Wilde"
      });
    }

    // Limit results if provided
    // Ergebnisse begrenzen, falls angegeben
    if (limit) {
      queryBuilder.take(limit); // SQL: LIMIT x
    }

    // Execute query and return all matching quotes
    // Abfrage ausführen und alle übereinstimmenden Zitate zurückgeben
    return queryBuilder.getMany();
  }

  // findOne - retrieves a single quote by ID
  // findOne - ruft ein einzelnes Zitat nach ID ab
  async findOne(id: number): Promise<Quote> {
    // Search database for quote with matching ID
    // Datenbank nach Zitat mit passender ID durchsuchen
    const quote = await this.quotesRepository.findOne({ where: { id } });

    // If no quote found, throw 404 error
    // Wenn kein Zitat gefunden, 404-Fehler werfen
    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }

    // Return the found quote
    // Das gefundene Zitat zurückgeben
    return quote;
  }

  // create - creates a new quote in the database
  // create - erstellt ein neues Zitat in der Datenbank
  async create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    // Create a new Quote entity instance (not saved yet)
    // Neue Quote-Entity-Instanz erstellen (noch nicht gespeichert)
    const newQuote = this.quotesRepository.create(createQuoteDto);

    // Save to database and return the saved quote (with ID and timestamp)
    // In Datenbank speichern und das gespeicherte Zitat zurückgeben (mit ID und Zeitstempel)
    return this.quotesRepository.save(newQuote);
  }

  // update - updates an existing quote in the database
  // update - aktualisiert ein vorhandenes Zitat in der Datenbank
  async update(id: number, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
    // First, find the existing quote (throws error if not found)
    // Zuerst das vorhandene Zitat finden (wirft Fehler, wenn nicht gefunden)
    const quote = await this.findOne(id);

    // Merge the update data into the existing quote object
    // Update-Daten in das vorhandene Zitat-Objekt einfügen
    Object.assign(quote, updateQuoteDto);

    // Save the updated quote to database
    // Das aktualisierte Zitat in der Datenbank speichern
    return this.quotesRepository.save(quote);
  }

  // remove - deletes a quote from the database
  // remove - löscht ein Zitat aus der Datenbank
  async remove(id: number): Promise<void> {
    // Delete the quote with the given ID
    // Das Zitat mit der angegebenen ID löschen
    const result = await this.quotesRepository.delete(id);

    // If no rows were affected, the quote didn't exist
    // Wenn keine Zeilen betroffen waren, existierte das Zitat nicht
    if (result.affected === 0) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    // No return value for successful deletion
    // Kein Rückgabewert bei erfolgreicher Löschung
  }
}
