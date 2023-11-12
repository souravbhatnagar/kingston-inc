import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../index.mjs'; // Modify the path to your index.js

chai.use(chaiHttp);

describe('Users API', () => {
  it('should get all users', (done) => {
    chai.request(app)
      .get('/api/users')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a new user', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({ username: 'testuser', email: 'test@example.com' })
      .end((err, res) => {
        chai.expect(res).to.have.status(201);
        chai.expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should get a user by ID', (done) => {
    chai.request(app)
      .get('/api/users/1') // Change the ID to an existing user's ID
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should update a user by ID', (done) => {
    chai.request(app)
      .put('/api/users/1') // Change the ID to an existing user's ID
      .send({ username: 'updateduser', email: 'updated@example.com' })
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('id');
        chai.expect(res.body.username).to.equal('updateduser');
        chai.expect(res.body.email).to.equal('updated@example.com');
        done();
      });
  });

  it('should delete a user by ID', (done) => {
    chai.request(app)
      .delete('/api/users/1') // Change the ID to an existing user's ID
      .end((err, res) => {
        chai.expect(res).to.have.status(204);
        done();
      });
  });
});
