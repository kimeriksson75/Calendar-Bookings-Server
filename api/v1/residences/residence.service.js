const db = require('../_helpers/db');

const Residence = db.Residence;

const create = async residenceParam => {
  try {
    const residence = await Residence.create(residenceParam);
    return residence;
  } catch (err) {
    throw new Error(err);
  }
}

const getAll = async () => {
  try {
    const residences = await Residence.find();
    return residences;
  } catch (err) {
    throw new Error(err);
  }
}

const getById = async id => {
  try {
    const residence = await Residence.findById(id);
    return residence;
  } catch (err) {
    throw new Error(err);
  }
}

const update = async (id, residenceParam) => {
  try {
    const residence = await Residence.findOneAndUpdate({ _id: id }, { $set: residenceParam }, { new: true });
    return residence;
  } catch (err) {
    throw new Error(err);
  }
}


const _delete = async id => {
  try {
    await Residence.findByIdAndRemove(id);
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: _delete
};