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

const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const value = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Lead ID is required'
            });
        }

        const result = await leadService.updateLead(id, value);

        return res.status(200).json({
            success: true,
            message: 'Lead updated successfully',
            data: result
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    }
};

const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;

        // basic validation
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Lead ID is required'
            });
        }

        const result = await leadService.deleteLead(id);

        return res.status(200).json({
            success: true,
            message: 'Lead deleted successfully',
            data: result
        });

    } catch (err) {
        // controlled errors
        if (err.message === 'Invalid lead ID') {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        if (err.message === 'Lead not found') {
            return res.status(404).json({
                success: false,
                message: err.message
            });
        }


        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// export the function
module.exports = {
    createLead,
    getAllLeads,
    getSpecificLeadById,
    updateLead,
    deleteLead
}