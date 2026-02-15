import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/playsetbd';
const dbName = process.env.MONGO_DB_NAME || 'playsetbd';

let client;
let clientPromise;
let cachedDb;

async function getMongoClient() {
  if (!clientPromise) {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
    });
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function getDb() {
  if (cachedDb) return cachedDb;
  const mongoClient = await getMongoClient();
  cachedDb = mongoClient.db(dbName);
  return cachedDb;
}
