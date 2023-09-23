import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as path from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    switch (process.env.NODE_ENV) {
      case 'development':
        return {
          type: 'sqlite',
          synchronize: false,
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          migrationsRun: false,
        };

      case 'test':
        return {
          type: 'sqlite',
          synchronize: false,
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          migrationsRun: true,
          migrations: [path.resolve(__dirname, '..') + '/migrations/*.ts'],
        };

      case 'production':
        return {
          type: 'postgres',
          synchronize: false,
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,
          migrationsRun: true,
          migrations: [path.resolve(__dirname, '..') + '/migrations/*.ts'],
          ssl: {
            rejectUnauthorized: false,
          },
        };

      case 'default':
        throw new Error('Unknown runtime environment');
    }
  }
}
