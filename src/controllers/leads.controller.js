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

const getAllLeads = async (req, res) => {
    try {
        const leads = await leadService.getAllLeads();

        res.status(200).json({
            success: true,
            data: leads,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
    }
}

const getSpecificLeadById = async (req, res) => {
    try {
        const id = req.params.id;
        const lead = await leadService.getSpecificLeadById(id);

        res.status(200).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
    }
}

// export the function
module.exports = {
    createLead,
    getAllLeads,
    getSpecificLeadById
}