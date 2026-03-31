/**
 * Title: 
 * Description: 
 * Author: MD Khaled Masud Hamim
 * Date: 31/03/2026
 */

// dependencies
const leadService = require('../services/leads.service')

// module functions
const createLead = async (req, res) => {
    try {
        const lead = await leadService.createLead(req.body);
        res.status(201).json(lead);
    } catch (error) {
        if (error.message === 'EMAIL_EXISTS') {
            return res.status(409).json({ message: 'Email already exists' });
        }

        res.status(500).json({ message: 'Internal server error' });
    }
};

// export the function
module.exports = {
    createLead,
}