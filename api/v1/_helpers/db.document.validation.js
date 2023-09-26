'use strict';
const mongoose = require('mongoose');

const { ValidationError, NotFoundError } = require('../../../_helpers/customErrors/customErrors');

const existingDocumentById = async (doc, id) => new Promise((resolve, reject) => {
    if (!isValidObjectId(id)) {
        reject(new ValidationError(`Invalid id ${id}`))
    }
    return doc.findById(id)
        .then(doc => doc ? resolve(doc) : reject(new NotFoundError(`Document with id ${id} does not exists`)))
        .catch(err => reject(new ValidationError(err?.message || `Error while getting document with id ${id}`)))
});


const isValidObjectId = id => {
    const result = mongoose.Types.ObjectId.isValid(id)
    if (!result) {
        throw new ValidationError(`Invalid id ${id}`)
    }
    return result;
}

module.exports = {
    existingDocumentById,
    isValidObjectId
}