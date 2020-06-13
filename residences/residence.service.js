const db = require('_helpers/db');

const Residence = db.Residence;

const create = async residenceParam => {
  const residence = new Residence(residenceParam);
  await residence.save();
  return residence;
}

const getAll = async () => await Residence.find();

const getById = async id => await Residence.findById(id);

const _delete = async id => await Residence.findOneAndRemove(id);

module.exports = {
  create,
  getAll,
  getById,
  delete: _delete
};