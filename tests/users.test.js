import { expect as _expect, use, request } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app/index'; // Modify the path to your index.js
const expect = _expect;

use(chaiHttp);

describe('Users API', () => {
  it('should get all users', (done) => {
    request(app)
      .get('/api/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a new user', (done) => {
    request(app)
      .post('/api/users')
      .send({ username: 'testuser', email: 'test@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should get a user by ID', (done) => {
    request(app)
      .get('/api/users/1') // Change the ID to an existing user's ID
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should update a user by ID', (done) => {
    request(app)
      .put('/api/users/1') // Change the ID to an existing user's ID
      .send({ username: 'updateduser', email: 'updated@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id');
        expect(res.body.username).to.equal('updateduser');
        expect(res.body.email).to.equal('updated@example.com');
        done();
      });
  });

  it('should delete a user by ID', (done) => {
    request(app)
      .delete('/api/users/1') // Change the ID to an existing user's ID
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });
});
