const request = require('supertest');
const app = require('../app');

describe('GET /api/v1/_health', () => {
    it('should return 200 OK', async () => {
        return request(app)
            .get('/api/v1/_health')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect({ status: 'ok' });
    });
});

describe('GET /api/v1', () => {
    it('should return 200 OK', async () => {
        return request(app)
            .get('/api/v1')
            .expect(200);
    });

    it('should return 404 Not Found', async () => {
        return request(app)
            .get('/api/v1/404')
            .expect(404);
    });
});


