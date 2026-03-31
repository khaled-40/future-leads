/**
 * Title: 
 * Description: 
 * Author: MD Khaled Masud Hamim
 * Date: 31/03/2026
 */


// dependencies
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
            id: result.insertedId,
            ...newLead
        };
    }catch(err) {
        console.log(err.message)
    }
}

// export the function 
module.exports = { createLead };