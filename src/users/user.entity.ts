import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
