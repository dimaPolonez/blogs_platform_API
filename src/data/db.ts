import { MongoClient } from 'mongodb'


const DB_URL = process.env.mongoURI || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(DB_URL);

export async function startBD () {
  try {
      await client.connect();
      await client.db("blogs_platform_API").command({ ping: 1});
      console.log("Connected successfully to mongo server";)
  } catch {
      await client.close();
  }
}