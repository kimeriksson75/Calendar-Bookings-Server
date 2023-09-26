const { validate, userSchema } = require('../../_helpers/db.schema.validation');

const mockUser = require('../mock-data/user.json');
const mockUserWithoutId = { ...mockUser };
delete mockUserWithoutId._id;
describe('validate()', () => {
    it('should validate a document against a schema', async () => {
        const result = await validate(userSchema, mockUserWithoutId);
        expect(result.value).toEqual(mockUserWithoutId)
        expect(result.error).toBeUndefined()
    });

    it('should throw an error if the document does not match the schema', async () => {
        await expect(validate(userSchema, { ...mockUserWithoutId, email: 'invalid email' })).rejects.toThrow('\"email\" must be a valid email')
    });

    it('should throw an error if the document is not an object', async () => {
        await expect(validate(userSchema, 'invalid document')).rejects.toThrow('\"value\" must be of type object')
    });
});
