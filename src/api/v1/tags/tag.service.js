const {
    NotFoundError,
    ValidationError
} = require("../../../_helpers/customErrors/customErrors");
  
const { Tag, User, Service } = require("../_helpers/db");
const {
    generateTokens,
} = require("../_helpers/token.validation");

const verify = async ({ tag, userId }) => {
    console.log('verify', tag, userId);
    const existingTag = await Tag.findOne({ tag });
    let users;
    let services;

    let user;
    if (!existingTag) {
        users = await User.find();
        services = await Service.find();
        return {
            tag: existingTag,
            users: users,
            services: services,
            user: user,
        };
    }
    const connectedUser = await User.findById(existingTag.userId);
    if (!connectedUser) {
        return {
            tag: existingTag,
            users: users,
            services: services,
            user: user,

        };
    }

    return {
        tag: existingTag,
        users: users,
        services: services,
        user: connectedUser,
    };
}

const connect = async (tag) => {
    const users = await User.find();
    return {
        users,
        tag
    }
}

const create = async (params) => {
    const { username, scannerId, tag, servicename } = params;

    const existingUser = await User.findOne({ username })
    if (!existingUser) {
        throw new NotFoundError(`User ${username} does not exist`);
    }
    const existingService = await Service.findOne({ name: servicename });
    if (!existingService) {
        throw new NotFoundError(`Service ${servicename} does not exist`);
    }
    const refTag = {
        tag,
        scannerId,
        userId: existingUser._id,
        serviceId: existingService._id
    }
    const createdTag = await Tag.create(refTag);
    if (!createdTag) {
        throw new ValidationError('Error while creating tag')
    }
    return createdTag;
}

const authenticate = async tag => {
    const existingTag = await Tag.findOne({ tag })
    // existing user
    if (!existingTag) {
        throw new NotFoundError(`Tag ${tag} does not exist`)
    }
    const existingUser = await User.findById(existingTag.userId);
    if (!existingUser) {
        throw new NotFoundError(`User ${existingTag.userId} does not`);
    }
    
    const existingService = await Service.findById(existingTag.serviceId);
    if (!existingService) {
        throw new NotFoundError(`Service ${existingTag.serviceId} does not`);
    }

    const { accessToken, refreshToken } = await generateTokens(existingUser);

    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    // const token = await verifyToken(existingTag._id)

    return {
        tag: existingTag,
        user: existingUser,
        service: existingService,
        accessToken,
        refreshToken
    }
}

const getAll = async () => {
    return await Tag.find()
}

const get = async id => {
    const tag = await Tag.findById(id);
    if (!tag) {
        throw new NotFoundError('Tag does not exist');
    }
    return tag;
}

const _delete = async id => {
    const tag = await Tag.findByIdAndRemove(id)
    if (!tag) {
        throw new NotFoundError('Tag does not exist');
    }
    return tag;
}

module.exports = {
    verify,
    connect,
    create,
    authenticate,
    getAll,
    get,
    delete: _delete,
}