import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`Inserted user in DB: ${this.id}, ${this.email}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user in DB: ${this.id}, ${this.email}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed user from DB: ${this.id}, ${this.email}`);
  }
}