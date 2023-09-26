const request = require('supertest');
const app = require('../../../../../app');

const mockResidence = {
    name: 'Residence 1',
    address: 'Address 1'
};
let createdResidenceId;

describe('POST /api/v1/residences', () => {
    it('should return 201 Created', async () => {
        return request(app)
            .post('/api/v1/residences/')
            .send(mockResidence)
            .expect(201)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.name).toEqual(mockResidence.name);
                expect(res.body.address).toEqual(mockResidence.address)
                createdResidenceId = res.body._id;
        });
    });
});

describe('GET /api/vi/residences', () => {
    it('should return all residences in the database', async () => {
        return request(app)
            .get('/api/v1/residences')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body.length).toBeGreaterThan(0);
            });
    });
});

describe('GET /api/v1/residences/:id', () => {
    it('should return a residence if valid id is provided', async () => {
        return request(app)
            .get(`/api/v1/residences/${createdResidenceId}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.name).toEqual('Residence 1');
                expect(res.body.address).toEqual('Address 1');
            });
    });
});

describe('PATCH /api/v1/residences/:id', () => {
    it('should return 200 OK', async () => {
        return request(app)
            .patch(`/api/v1/residences/${createdResidenceId}`)
            .send({ name: 'Residence 2', address: 'Address 2' })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.name).toEqual('Residence 2');
                expect(res.body.address).toEqual('Address 2');
            });
    });
});
    
describe('DELETE /api/v1/residences/:id', () => {
    it('should return 200 OK', async () => {
        return request(app)
            .delete(`/api/v1/residences/${createdResidenceId}`)
            .expect(200);
    });
});
