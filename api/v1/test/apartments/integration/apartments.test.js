const request = require('supertest');
const app = require('../../../../../app');

let mockApartment = {
    name: 'Apartment 1',
};

let createdApartmentId;

beforeAll(async () => {
    await request(app)
        .post('/api/v1/residences')
        .send({ name: 'Residence 1', address: 'Address 1' })
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(res => {
            expect(res.body.name).toEqual('Residence 1');
            expect(res.body.address).toEqual('Address 1');
            mockApartment.residence = createdResidenceId = res.body._id;
        });
});

afterAll(async () => {
    await request(app)
        .delete(`/api/v1/residences/${createdResidenceId}`)
        .expect(200);
});

describe('POST /api/v1/apartments', () => {
    it('should return 201 Created', async () => {
        return request(app)
            .post('/api/v1/apartments')
            .send(mockApartment)
            .expect(201)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.name).toEqual(mockApartment.name);
                expect(res.body.residence).toEqual(mockApartment.residence);
                createdApartmentId = res.body._id;
            });
    });

    it('should return 400 Bad Request while invalid apartment params', async () => {
        return request(app)
            .post('/api/v1/apartments')
            .send({ ...mockApartment, residence: 'invalid' })
            .expect(400)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.message).toEqual("\"residence\" must only contain hexadecimal characters");
            });
    });
});

describe('GET /api/v1/apartments', () => {
    it('should return all apartments in the database', async () => {
        return request(app)
            .get('/api/v1/apartments')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body.length).toBeGreaterThan(0);
            });
    });

    it('should handle errors', async () => {
        const apartmentService = require('../../../apartments/apartment.service');
        const { ValidationError } = require('../../../../../_helpers/customErrors/customErrors');
        jest.spyOn(apartmentService, 'getAll').mockRejectedValue(new ValidationError('Error while getting apartments'));
        return request(app)
            .get('/api/v1/apartments')
            .expect(400)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body.message).toEqual("Error while getting apartments");
            });
    });
});

describe('GET /api/v1/apartments/:id', () => {
    it('should return an apartment if valid id is provided', async () => {
        return request(app)
            .get(`/api/v1/apartments/${createdApartmentId}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.name).toEqual('Apartment 1');
                expect(res.body.residence).toEqual(createdResidenceId);
            });
    });

    it('should return 400 Bad request if invalid id is provided', async () => {
        return request(app)
            .get('/api/v1/apartments/invalid')
            .expect(400)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.message).toEqual("Invalid id invalid");
            });
    });

    it('should return 404 Not Found if id is not found', async () => {
        return request(app)
            .get(`/api/v1/apartments/650991a92ad13cb743a28e92`)
            .expect(404)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.message).toEqual("Apartment with id 650991a92ad13cb743a28e92 does not exists");
            });
    });
});

describe('PATCH /api/v1/apartments/:id', () => {
    it('should return 200 OK', async () => {
        return request(app)
            .patch(`/api/v1/apartments/${createdApartmentId}`)
            .send({ name: 'Apartment 2', residence: createdResidenceId })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.name).toEqual('Apartment 2');
                expect(res.body.residence).toEqual(createdResidenceId);
            });
    });

    it('should return 400 Bad request if invalid id is provided', async () => {
        return request(app)
            .patch('/api/v1/apartments/invalid')
            .send({ name: 'Apartment 2', residence: createdResidenceId})
            .expect(400)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.message).toEqual("Invalid id invalid");
            });
    });

    it('should return 404 Not found if id does not exist', async () => {
        return request(app)
            .patch('/api/v1/apartments/650991a92ad13cb743a28e92')
            .send({ name: 'Apartment 2', residence: createdResidenceId})
            .expect(404)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.message).toEqual("Apartment with id 650991a92ad13cb743a28e92 does not exists");
            });
    });

    it('should return 400 Bad Request if invalid apartment params are provided', async () => {
        return request(app)
            .patch(`/api/v1/apartments/${createdApartmentId}`)
            .send({ name: 'Apartment 2', residence: 'invalid' })
            .expect(400)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.message).toEqual("\"residence\" must only contain hexadecimal characters");
            });
    });
});

describe('DELETE /api/v1/apartments/:id', () => {
    it('should return 200 OK', async () => {
        return request(app)
            .delete(`/api/v1/apartments/${createdApartmentId}`)
            .expect(200);
    });

    it('should return 400 Bad Request if invalid id is provided', async () => {
        return request(app)
            .delete('/api/v1/apartments/invalid')
            .expect(400)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.message).toEqual("Invalid id invalid");
            });
    });

    it('should return 404 Not Found if id is not found', async () => {
        return request(app)
            .delete(`/api/v1/apartments/${createdApartmentId}`)
            .expect(404)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body.message).toEqual(`Apartment with id ${createdApartmentId} does not exists`);
            });
    });
});