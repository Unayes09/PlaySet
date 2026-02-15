import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/playsetbd';
const dbName = process.env.MONGO_DB_NAME || 'playset';

let client;
let clientPromise;
let cachedDb;

async function getMongoClient() {
  if (!clientPromise) {
    console.log('[mongo] creating MongoClient for', uri);
    client = new MongoClient(uri, {
      maxPoolSize: 10,
    });
    clientPromise = client
      .connect()
      .then((connected) => {
        console.log('[mongo] MongoClient connected successfully');
        return connected;
      })
      .catch((err) => {
        console.error('[mongo] MongoClient connection error:', err?.message || err);
        throw err;
      });
  }
  return clientPromise;
}

export async function getDb() {
  if (cachedDb) return cachedDb;
  const mongoClient = await getMongoClient();
  cachedDb = mongoClient.db(dbName);
  console.log('[mongo] using database', dbName);
  return cachedDb;
}
