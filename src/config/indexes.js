const { getCollections } = require("../models/collections");


const ensureIndexes = async () => {
    const { leads, tasks } = await getCollections();

    // Enforce idempotency
    await tasks.createIndex(
        { lead_id: 1, followup_stage: 1, status: 1 },
        { unique: true, partialFilterExpression: { status: 'pending' } }
    );

    // Speed up worker query
    await leads.createIndex({
        next_followup_at: 1,
        followup_count: 1,
        has_replied: 1
    });

    console.log("Indexes ensured");
};

module.exports = ensureIndexes;