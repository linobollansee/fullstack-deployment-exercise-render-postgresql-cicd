// Import Injectable decorator - marks this class as a service that can be injected
// Injectable-Dekorator importieren - markiert diese Klasse als injizierbaren Service
import {
  Injectable,
  NotFoundException, // Thrown when a user is not found / Wird geworfen, wenn ein Benutzer nicht gefunden wird
  ConflictException, // Thrown when email already exists / Wird geworfen, wenn E-Mail bereits existiert
} from "@nestjs/common";

// Import InjectRepository - allows us to inject the database repository
// InjectRepository importieren - ermöglicht Injektion des Datenbank-Repositorys
import { InjectRepository } from "@nestjs/typeorm";

// Import Repository from TypeORM - database operations
// Repository von TypeORM importieren - Datenbankoperationen
import { Repository } from "typeorm";

// Import User entity - represents the database table
// User-Entity importieren - repräsentiert die Datenbanktabelle
import { User } from "./entities/user.entity";

// Import DTOs - define the shape of incoming data
// DTOs importieren - definieren die Form der eingehenden Daten
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

// @Injectable - marks this class as a service that can be dependency-injected
// @Injectable - markiert diese Klasse als Service, der dependency-injected werden kann
@Injectable()
export class UsersService {
  // Constructor - inject the User repository for database operations
  // Konstruktor - User-Repository für Datenbankoperationen injizieren
  constructor(
    // @InjectRepository - injects the TypeORM repository for User entity
    // @InjectRepository - injiziert das TypeORM-Repository für User-Entity
    @InjectRepository(User)
    private usersRepository: Repository<User> // Database access layer / Datenbankzugriffsschicht
  ) {}

  // findAll - retrieves all users with optional limit
  // findAll - ruft alle Benutzer mit optionaler Begrenzung ab
  async findAll(limit?: number): Promise<User[]> {
    // Create a query builder to construct database queries
    // Query-Builder erstellen, um Datenbankabfragen zu konstruieren
    const queryBuilder = this.usersRepository.createQueryBuilder("user");

    // Limit results if provided
    // Ergebnisse begrenzen, falls angegeben
    if (limit) {
      queryBuilder.take(limit); // SQL: LIMIT x
    }

    // Execute query and return all matching users
    // Abfrage ausführen und alle übereinstimmenden Benutzer zurückgeben
    return queryBuilder.getMany();
  }

  // findOne - retrieves a single user by ID
  // findOne - ruft einen einzelnen Benutzer nach ID ab
  async findOne(id: number): Promise<User> {
    // Search database for user with matching ID
    // Datenbank nach Benutzer mit passender ID durchsuchen
    const user = await this.usersRepository.findOne({ where: { id } });

    // If no user found, throw 404 error
    // Wenn kein Benutzer gefunden, 404-Fehler werfen
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Return the found user
    // Den gefundenen Benutzer zurückgeben
    return user;
  }

  // create - creates a new user in the database
  // create - erstellt einen neuen Benutzer in der Datenbank
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists (email must be unique)
    // Prüfen, ob E-Mail bereits existiert (E-Mail muss eindeutig sein)
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    // If email exists, throw 409 Conflict error
    // Wenn E-Mail existiert, 409-Konflikt-Fehler werfen
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    // Create a new User entity instance (not saved yet)
    // Neue User-Entity-Instanz erstellen (noch nicht gespeichert)
    const newUser = this.usersRepository.create(createUserDto);

    // Save to database and return the saved user (with ID and timestamp)
    // In Datenbank speichern und den gespeicherten Benutzer zurückgeben (mit ID und Zeitstempel)
    return this.usersRepository.save(newUser);
  }

  // update - updates an existing user in the database
  // update - aktualisiert einen vorhandenen Benutzer in der Datenbank
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // First, find the existing user (throws error if not found)
    // Zuerst den vorhandenen Benutzer finden (wirft Fehler, wenn nicht gefunden)
    const user = await this.findOne(id);

    // Check if email is being updated and if it already exists
    // Prüfen, ob E-Mail aktualisiert wird und ob sie bereits existiert
    if (updateUserDto.email) {
      // Look for another user with this email
      // Nach einem anderen Benutzer mit dieser E-Mail suchen
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      // If found and it's NOT the current user, throw conflict error
      // Wenn gefunden und es ist NICHT der aktuelle Benutzer, Konflikt-Fehler werfen
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException("Email already exists");
      }
    }

    // Merge the update data into the existing user object
    // Update-Daten in das vorhandene Benutzer-Objekt einfügen
    Object.assign(user, updateUserDto);

    // Save the updated user to database
    // Den aktualisierten Benutzer in der Datenbank speichern
    return this.usersRepository.save(user);
  }

  // remove - deletes a user from the database
  // remove - löscht einen Benutzer aus der Datenbank
  async remove(id: number): Promise<void> {
    // Delete the user with the given ID
    // Den Benutzer mit der angegebenen ID löschen
    const result = await this.usersRepository.delete(id);

    // If no rows were affected, the user didn't exist
    // Wenn keine Zeilen betroffen waren, existierte der Benutzer nicht
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // No return value for successful deletion
    // Kein Rückgabewert bei erfolgreicher Löschung
  }
}
