import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { scrypt as _scrypt} from "crypto";
import { promisify } from "util";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { find } from "rxjs";



describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const scrypt = promisify(_scrypt);

  beforeEach(async () => {
      // create fake copy of UsersService
      const users: User[] = [];

      fakeUsersService = {
        find: (email:string) => {
          const filteredUsers = users.filter(user => user.email === email);
          return Promise.resolve(filteredUsers);
        },
        create: (email: string, password: string) => {
          const user = {id: Math.floor(Math.random()*999999), email, password} as User;
           users.push(user);
           return Promise.resolve(user);
        },
      };
      const module = await Test.createTestingModule(
        {
          providers: [
            AuthService,
            {
              provide: UsersService,
              useValue: fakeUsersService,
            }
          ],
        }
      ).compile();
    
      service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const testPassword = 'aefazmi$_';
    const user = await service.signup('test@abc.com', testPassword);
    expect(user.password).not.toEqual(testPassword);

    const [salt, savedHash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(savedHash).toBeDefined();
    const hash = await scrypt(testPassword, salt, 32) as Buffer;
    expect(hash.toString('hex')).toEqual(savedHash);
  });

  it('throws Bad Request error if user signs up with email already in use', async() => {
    await expect(service.signup('test@test.com', 'mypass'))
      .resolves.toBeDefined();
    await expect(service.signup('test@test.com', 'mypass2'))
      .rejects.toThrow(BadRequestException);
    expect.assertions(2);
  });

  it('throw not found error if the sign-in email does not match with a user', async() => {
    await expect(service.signup('test@test.com', 'mypass'))
      .resolves.toBeDefined();
    await expect(service.signin('test2@test.com', 'mypass'))
      .rejects.toThrow(NotFoundException);
    expect.assertions(2);
  });

  it('throws if an invalid password is provided', async () => {
    await expect(service.signup('test@test.com', 'mypass'))
      .resolves.toBeDefined();
    await expect(service.signin('test@test.com', 'password'))
      .rejects.toThrow(BadRequestException)
      expect.assertions(2);
  });

  it('returns a user if correct password is provided', async() => {
    const user = await service.signup('test@test.com', 'mypass');
    //console.log(user);
    const user2 = await service.signin(user.email, 'mypass');
    expect(user2).toEqual(user);
    
  })
});