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
export class Quote {
  // @PrimaryGeneratedColumn - auto-incrementing unique ID (1, 2, 3, ...)
  // @PrimaryGeneratedColumn - automatisch inkrementierende eindeutige ID (1, 2, 3, ...)
  @PrimaryGeneratedColumn()
  id: number;

  // @Column - regular column for storing the quote text
  // @Column - reguläre Spalte zum Speichern des Zitat-Texts
  @Column()
  text: string;

  // @Column - regular column for storing the author's name
  // @Column - reguläre Spalte zum Speichern des Autorennamens
  @Column()
  author: string;

  // @CreateDateColumn - automatically sets timestamp when record is created
  // @CreateDateColumn - setzt automatisch Zeitstempel, wenn Datensatz erstellt wird
  @CreateDateColumn()
  createdAt: Date;
}
