const db = require('_helpers/db');

const Activity = db.Activity;

const create = async activityParam => {
  const activity = new Activity(activityParam);
  await activity.save();
  return activity;
}

const getAll = async () => await Activity.find();

const getById = async id => await Activity.findById(id);

const getClient = async userid => await Activity.find({ clientid });

const _delete = async id => await Activity.findOneAndRemove(id);

module.exports = {
  create,
  getAll,
  getById,
  getClient,
  delete: _delete
};