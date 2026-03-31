/**
 * Title: 
 * Description: 
 * Author: MD Khaled Masud Hamim
 * Date: 30/03/2026
 */

// dependencies
const { getDB } = require("../config/db");

// module function
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

// export the module
module.exports = { getCollections };