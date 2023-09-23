import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a sign up request', () => {
    const email = 'email7@xyz.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email: email, password: 'passtest', hack:true})
      .expect(201)
      .then((res) => {
        const {id, email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup as new user and then get the currently logged in user', async () => {
    const email = 'email7@xyz.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({email: email, password: 'passtest'})
      .expect(201)
    
    const cookie = res.get('Set-Cookie');

    const {body} = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
  
    console.log(body);
    expect(body.email).toEqual(email);
  });
});