const request = require("supertest");
const app = require("../../../app");

const deleteDocument = async (collection, id) => {
  await request(app).delete(`/api/v1/${collection}/${id}`).expect(200);
};

const authDeleteDocument = async (collection, id, token) => {
  await request(app)
    .delete(`/api/v1/${collection}/${id}`)
    .auth(token, { type: "bearer" })
    .expect(200);
};

const createDocument = async (collection, document, id = true) => {
  let returnValue;
  await request(app)
    .post(`/api/v1/${collection}`)
    .send(document)
    .expect(201)
    .expect("Content-Type", /json/)
    .expect((res) => {
      returnValue = id ? res.body._id : res.body;
    });
  return returnValue;
};

const authCreateDocument = async (collection, document, token, id = true) => {
  let returnValue;
  await request(app)
    .post(`/api/v1/${collection}`)
    .auth(token, { type: "bearer" })
    .send(document)
    .expect(201)
    .expect("Content-Type", /json/)
    .expect((res) => {
      returnValue = id ? res.body._id : res.body;
    });
  return returnValue;
};

const authCreateBookingDocument = async (collection, document, userId, token, id = true) => {
  let returnValue;
  await request(app)
    .post(`/api/v1/${collection}/${userId}`)
    .auth(token, { type: "bearer" })
    .send(document)
    .expect(201)
    .expect("Content-Type", /json/)
    .expect((res) => {
      returnValue = id ? res.body._id : res.body;
    });
  return returnValue;
};

const authenticate = async ({ username, password }) => {
  let returnValue;
  await request(app)
    .post("/api/v1/users/authenticate")
    .send({ username, password })
    .expect(200)
    .expect("Content-Type", /json/)
    .expect((res) => {
      returnValue = res.body;
    });
  return returnValue;
};

const findAndRemoveUserToken = async (userId) => {
  await request(app)
    .get(`/api/v1/tokens/user/${userId}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .expect(async (res) => {
      if (!res.body) {
        return;
      }
      await request(app).delete(`/api/v1/tokens/${res.body._id}`).expect(200);
    });
};

module.exports = {
  deleteDocument,
  authDeleteDocument,
  createDocument,
  authCreateDocument,
  authCreateBookingDocument,
  authenticate,
  findAndRemoveUserToken,
};
