const {
    NotFoundError, ValidationError,
} = require("../../../_helpers/customErrors/customErrors");
  
const { Residence, Service, Scanner } = require("../_helpers/db");
const {
    verifyToken,
} = require("../_helpers/token.validation");
  
const verify = async ({ scanner }) => {
    const existingScanner = await Scanner.findOne({ scannerId: scanner })
    let residences;
    if (!existingScanner) {
        residences = await Residence.find();

        //throw new NotFoundError(`Scanner id: ${scanner} does not exist`);
    }
    return {
        scanner: existingScanner,
        residences: residences
    };
}

const connect = async (scanner) => {
    const residences = await Residence.find();
    return {
        residences,
        scanner
    }
}

const create = async (id, params) => {
    const { residence, service } = params

    const existingResidence = await Residence.findOne({ name: residence })
    
    if (!existingResidence) {
        throw new NotFoundError('Residence does not exist')
    }

    const existingService = await Service.findOne({ name: service })

    if (!existingService) {
        throw new NotFoundError('Service does not exist')
    }

    const scanner = {
        scannerId: id,
        residenceId: existingResidence._id,
        serviceId: existingService._id
    }

    const createdScanner = await Scanner.create(scanner);

    if (!createdScanner) {
        throw new ValidationError('Error creating scanner')
    }

    return createdScanner;
}

const authenticate = async scannerId => {
    const existingScanner = await Scanner.findOne({scannerId})
    if (!existingScanner) {
        throw new NotFoundError(`Scanner ${scannerId} does not exist`)
    }
    const token = await verifyToken(existingScanner._id)
    console.log('token', token)

    return {
        scanner: existingScanner,
        token: token.token
    }
}
module.exports = {
    verify,
    connect,
    create,
    authenticate
}