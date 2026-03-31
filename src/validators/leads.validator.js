/**
 * Title: 
 * Description: 
 * Author: MD Khaled Masud Hamim
 * Date: 31/03/2026
 */

// dependencies
const joi = require('joi');

// reusable enums
const PLATFORM_ENUM = ['linkedin', 'google', 'facebook'];
const STATUS_ENUM = [
    'new',
    'contacted',
    'replied',
    'interested',
    'converted',
    'ignored',
    'failed',
];

// module variable
const createLeadsSchema = joi.object({
    name: joi.string().trim().min(2).max(100).required(),

    email: joi.string().email().required(),

    platform: joi.string()
        .valid(...PLATFORM_ENUM)
        .required(),

    source_url: joi.string()
        .uri()
        .required(),

    niche: joi.string().trim().min(2).max(100).optional(),

    status: joi.string()
        .valid(...STATUS_ENUM)
        .default('new'),

    // scoring (optional at creation, you may calculate later)
    lead_score: joi.number().min(0).max(100).optional(),

    score_breakdown: joi.object({
        ability: joi.number().min(0).max(30).required(),
        need: joi.number().min(0).max(30).required(),
        authority: joi.number().min(0).max(20).required(),
        reachability: joi.number().min(0).max(20).required(),
    }).optional(),

    last_contacted_at: joi.date().optional(),

    next_followup_at: joi.date().greater('now').optional(),

    followup_count: joi.number()
        .integer()
        .min(0)
        .max(3)
        .default(0),

    notes: joi.string().max(1000).optional(),

    created_at: joi.date().default(() => new Date()),
});

// export the variable
module.exports = { createLeadsSchema };