import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({id, email: 'test@test.com', password: 'mypass'} as User);
      },
      find: (email: string) => {
        return Promise.resolve([{id:1, email, password:'mypass'} as User]);
      },
      // remove: () => {},
      // update: () => {},
    };

    fakeAuthService = {
      signin: (email:string, password: string) => {
        return Promise.resolve({id:1, email, password} as User);
      },
      // signup: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of user with given email', async () => {
    const users = await controller.findAllUsers('test@abc.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@abc.com');
  });

  it('findUser returns the user by id', async() => {
    const user = await controller.findUser('1');
    expect(user.id).toEqual(1);
  });

  it ('findUser throws if id not found', async() => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1'))
      .rejects.toThrow(NotFoundException);
    expect.assertions(1);
  });

  it ('signin updates sesion object and returns user', async() => {
    const session = {userId: -10};
    const user = await controller.signin({email: 'test@test.com', password: 'game'},
      session);
    
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

});
