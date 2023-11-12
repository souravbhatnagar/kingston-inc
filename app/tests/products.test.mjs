import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../index.mjs'; // Modify the path to your index.js

chai.use(chaiHttp);

describe('Products API', () => {
  it('should get all products', (done) => {
    chai.request(app)
      .get('/api/products')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a new product', (done) => {
    chai.request(app)
      .post('/api/products')
      .send({ name: 'Test Product', description: 'A test product', price: 10.99 })
      .end((err, res) => {
        chai.expect(res).to.have.status(201);
        chai.expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should get a product by ID', (done) => {
    chai.request(app)
      .get('/api/products/1') // Change the ID to an existing product's ID
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should update a product by ID', (done) => {
    chai.request(app)
      .put('/api/products/1') // Change the ID to an existing product's ID
      .send({ name: 'Updated Product', description: 'Updated description', price: 19.99 })
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('id');
        chai.expect(res.body.name).to.equal('Updated Product');
        chai.expect(res.body.description).to.equal('Updated description');
        chai.expect(res.body.price).to.equal(19.99);
        done();
      });
  });

  it('should delete a product by ID', (done) => {
    chai.request(app)
      .delete('/api/products/1') // Change the ID to an existing product's ID
      .end((err, res) => {
        chai.expect(res).to.have.status(204);
        done();
      });
  });
});
