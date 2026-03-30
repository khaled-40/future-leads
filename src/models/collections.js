const { getDB } = require("../config/db");


const getCollections = async () => {
  const db = await getDB();

  return {
    leads: db.collection('leads'),
    messages: db.collection('messages'),
    users: db.collection('users'),
    outreach_logs: db.collection('outreach_logs'),
    tasks: db.collection('tasks')
  };
};

module.exports = { getCollections };