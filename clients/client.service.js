const db = require('_helpers/db');

const Client = db.Client;

const create = async clientParam => {
  const client = new Client(clientParam);
  await client.save();
  return client;
}

const getAll = async () => await Client.find();

const getById = async id => await Client.findById(id);

const getByUser = async userid => await Client.find({ userid });

const _delete = async id => await Client.findOneAndRemove(id);

module.exports = {
  create,
  getAll,
  getById,
  getByUser,
  delete: _delete
};