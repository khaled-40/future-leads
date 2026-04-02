/**
 * Title: 
 * Description: 
 * Author: MD Khaled Masud Hamim
 * Date: 31/03/2026
 */


// dependencies
const { ObjectId } = require("mongodb");
const { getCollections } = require("../models/collections");

// module function
const createLead = async (data) => {
    try {
        const { leads } = await getCollections();
        const email = data.email.toLowerCase().trim();

        // 2. Check duplicate email
        const existingLead = await leads.findOne({ email });

        if (existingLead) {
            throw new Error('Lead with this email already exists', 409);
        }

        const result = await leads.insertOne(data);

        return {
            id: result.insertedId
        };
    } catch (err) {
        console.log(err.message)
    }
}

const getAllLeads = async () => {
    const { leads } = await getCollections();
    const cursor = leads.find();
    const result = await cursor.toArray();

    return result;
};

const getSpecificLeadById = async (id) => {
    const { leads } = await getCollections();
    const query = { _id: new ObjectId(id) };
    const result = await leads.findOne(query);

    return result;
}

// export the function 
module.exports = {
    createLead,
    getAllLeads,
    getSpecificLeadById
};