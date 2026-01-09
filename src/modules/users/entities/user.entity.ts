import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * TOPIC: Database Integration with TypeORM
 * 
 * Entities are TypeORM models that map to database tables
 * Decorators define the schema
 */

@Entity('users') // Table name
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'simple-json', nullable: true })
  address: {
    street: string;
    city: string;
    country: string;
    zipCode?: string;
  };

  @Column({ type: 'simple-json', nullable: true })
  hobbies: string[];

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'datetime', nullable: true })
  birthDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
