const { MongoClient, ServerApiVersion } = require('mongodb');

let client;
let db;

const connectDB = async () => {
    if (db) return db;

    try {
        const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uk3n3pp.mongodb.net/?appName=Cluster0`;

        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();

        db = client.db('future-lead');

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });

        console.log('MongoDB connected');

        return db;
    } catch(error) {
        console.error('MongoDB connection failed:',error);

        // Critical: reset state so retry works
        db = null;
        client = null;

        throw error; // let upper layer handle it
    }
};

const getDB = async () => {
    if (!db) {
        await connectDB();
    }
    return db;
};

module.exports = { connectDB, getDB };