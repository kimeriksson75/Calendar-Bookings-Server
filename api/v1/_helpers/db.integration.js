const request = require('supertest');
const app = require('../../../app');

const deleteDocument = async (collection, id) => {
    await request(app)
      .delete(`/api/v1/${collection}/${id}`)
      .expect(200);
}

const createDocument = async (collection, document) => {
    let createdDocumentId;
    await request(app)
      .post(`/api/v1/${collection}`)
      .send(document)
      .expect(201)
      .expect('Content-Type', /json/)
      .expect(res => {
          createdDocumentId = res.body._id;
      });
    return createdDocumentId;
}

module.exports = {
    deleteDocument,
    createDocument
}