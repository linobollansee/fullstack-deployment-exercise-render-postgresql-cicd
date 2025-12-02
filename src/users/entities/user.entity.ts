// Import TypeORM decorators to define database table structure
// TypeORM-Dekoratoren importieren, um Datenbanktabellenstruktur zu definieren
import {
  Entity, // Marks class as database table / Markiert Klasse als Datenbanktabelle
  PrimaryGeneratedColumn, // Auto-increment primary key / Auto-inkrement Primärschlüssel
  Column, // Regular database column / Reguläre Datenbankspalte
  CreateDateColumn, // Automatic timestamp column / Automatische Zeitstempelspalte
} from "typeorm";

// @Entity decorator - marks this class as a database table
// @Entity-Dekorator - markiert diese Klasse als Datenbanktabelle
@Entity()
export class User {
  // @PrimaryGeneratedColumn - auto-incrementing unique ID (1, 2, 3, ...)
  // @PrimaryGeneratedColumn - automatisch inkrementierende eindeutige ID (1, 2, 3, ...)
  @PrimaryGeneratedColumn()
  id: number;

  // @Column with unique constraint - email must be unique (no duplicates)
  // @Column mit unique-Einschränkung - E-Mail muss eindeutig sein (keine Duplikate)
  @Column({ unique: true })
  email: string;

  // @Column - stores password (plain text for learning only!)
  // @Column - speichert Passwort (Klartext nur zum Lernen!)
  @Column()
  password: string;

  // @CreateDateColumn - automatically sets timestamp when user is created
  // @CreateDateColumn - setzt automatisch Zeitstempel, wenn Benutzer erstellt wird
  @CreateDateColumn()
  createdAt: Date;
}
