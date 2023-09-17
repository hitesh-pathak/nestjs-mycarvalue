import {
  Controller,
  Post,
  Get,
  Patch,
  Query,
  Body,
  Param,
  Delete,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { currentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/auth')
@Serialize(UserDto)
export class UsersController {

constructor(private authService: AuthService,
  private usersService: UsersService) {
}


@Get('/whoami')
@UseGuards(AuthGuard)
whoAmI(@currentUser() user: User) {
   return user;
}

@Post('signout')
signOut(@Session() session: any) {
  session.userId = null;
}

@Post('/signup')
async createUser(@Body() body: CreateUserDto, @Session() session: any) {
  const user = await this.authService.signup(body.email, body.password);
  session.userId = user.id;
  return user;
}

@Post('/signin')
async signin(@Body() body: CreateUserDto, @Session() session: any) {
  const user = await this.authService.signin(body.email, body.password);
  session.userId = user.id;
  return user;
}
 
@Get('/:id')
findUser(@Param('id') id: string) {
  return this.usersService.findOne(parseInt(id));
}

@Get()
findAllUsers(@Query('email') email: string) {
  return this.usersService.find(email);
}

@Delete('/:id')
removeUser(@Param('id') id: string) {
  return this.usersService.remove(parseInt(id));

}

@Patch('/:id')
updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
  return this.usersService.update(parseInt(id), body);
}

}
