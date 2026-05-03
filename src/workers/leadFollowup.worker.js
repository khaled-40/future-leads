// workers/followup.worker.js
const cron = require('node-cron');
const { addDays } = require('../utils/date.util');
const { getCollections } = require('../models/collections');


const FOLLOWUP_DELAYS = [4, 5, 6];

const startFollowupWorker = () => {
    cron.schedule('*/1 * * * *', async () => {

        const { leads, tasks } = await getCollections();
        console.log(`[Worker] Running at ${new Date().toISOString()}`);
        const now = new Date();

        while (true) {

            try {

                // STEP 1: Atomically CLAIM one lead
                const lead = await leads.findOneAndUpdate(
                    {
                        has_replied: { $ne: true },
                        next_followup_at: { $lte: now },
                        followup_count: { $lt: 3 },
                        processing: { $ne: true }
                    },
                    {
                        $set: { processing: true }
                    },
                    { returnDocument: 'after' }
                );

                // No more work → exit loop
                if (!lead) break;

                // try {
                const taskResult = await tasks.updateOne(
                    {
                        lead_id: lead._id,
                        status: 'pending'
                    },
                    {
                        $setOnInsert: {
                            lead_id: lead._id,
                            type: 'follow_up',
                            followup_stage: lead.followup_count + 1,
                            status: 'pending',
                            created_at: now
                        }
                    },
                    { upsert: true }
                );

                // Update lead ONLY if task created
                if (taskResult.upsertedCount === 1) {
                    const nextDelay = FOLLOWUP_DELAYS[lead.followup_count] ?? null;

                    const updateFields = {};

                    if (nextDelay !== null) {
                        updateFields.next_followup_at = addDays(nextDelay);
                    } else {
                        updateFields.next_followup_at = null;
                        updateFields.followup_completed = true; // terminal state
                    }


                    await leads.updateOne(
                        { _id: lead._id },
                        {
                            $set: updateFields,
                            $currentDate: { last_contacted_at: true },
                            $unset: { processing: "" }
                        }
                    );


                } else {
                    // Task already exists → just release the lock
                    await leads.updateOne(
                        { _id: lead._id },
                        { $unset: { processing: "" } }
                    );
                }

                // console.log(`[Worker] Created ${taskDocs.length} follow-up tasks`);
                // } catch (err) {
                //     if (err.code !== 11000) {
                //         console.error('[Worker Error]', err.message);
                //     }
                // }

            } catch (err) {
                console.error('[Worker Error]', err.message);

                // IMPORTANT: release lock if something fails
                if (lead?._id) {
                    await leads.updateOne(
                        { _id: lead._id },
                        { $unset: { processing: "" } }
                    );
                }
            }
        }
    },
        {
            timezone: "Asia/Dhaka"
        });
}
module.exports = startFollowupWorker;