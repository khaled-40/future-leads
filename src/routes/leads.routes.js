/**
 * Title: 
 * Description: 
 * Author: MD Khaled Masud Hamim
 * Date: 31/03/2026
 */


// dependencies
const express = require('express');
const router = express.Router();
const { createLead, getAllLeads, getSpecificLeadById, updateLead, deleteLead } = require("../controllers/leads.controller");
const validate = require("../middlewares/validate");
const { createLeadsSchema, updateLeadSchema } = require("../validators/leads.validator");

// api routes
router.post('/', validate(createLeadsSchema), createLead);

router.get('/', getAllLeads);

router.get('/:id', getSpecificLeadById);

router.patch('/:id',validate(updateLeadSchema), updateLead);

router.delete('/:id',deleteLead);

// export the router
module.exports = router;