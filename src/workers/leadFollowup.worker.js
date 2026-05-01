// workers/followup.worker.js
const cron = require('node-cron');
const { getCollections } = require('../config/db');
const { addDays } = require('../utils/date.util');


const startFollowupWorker = () => {
    cron.schedule('*/10 * * * *', async () => {
        try {
            const { leads, tasks } = await getCollections();
            const now = new Date();

            // STEP 1: find eligible leads
            const dueLeads = await leads.find({
                has_replied: { $ne: true },
                next_followup_at: { $lte: now },
                followup_count: { $lt: 3 }
            }).toArray();

            if (!dueLeads.length) return;

            // STEP 2: create tasks
            const taskDocs = dueLeads.map(lead => ({
                lead_id: lead._id,
                type: 'follow_up',
                followup_stage: lead.followup_count + 1,
                status: 'pending',
                created_at: now
            }));

            await tasks.insertMany(taskDocs);

            // STEP 3: update leads (schedule next followup)
            const updateOps = dueLeads.map(lead => {
                let nextDelay = null;

                if (lead.followup_count === 0) nextDelay = 4;
                else if (lead.followup_count === 1) nextDelay = 5;
                else nextDelay = null; // stop after 3rd

                return {
                    updateOne: {
                        filter: { _id: lead._id },
                        update: {
                            $inc: { followup_count: 1 },
                            $set: {
                                last_contacted_at: now,
                                status: 'contacted',
                                next_followup_at: nextDelay ? addDays(nextDelay) : null
                            }
                        }
                    }
                };
            });

            await leads.bulkWrite(updateOps);

            console.log(`[Worker] Created ${taskDocs.length} follow-up tasks`);

        } catch (err) {
            console.error('[Worker Error]', err.message);
        }
    }, {
        timezone: "Asia/Dhaka"
    });
};

module.exports = startFollowupWorker;