import { MongoClient } from 'mongodb';
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';
import { blogsFieldsType } from '../models/data.models';
import { postsFieldsType } from '../models/data.models';

dotenv.config();

const DB_URL = process.env.mongoURI || 'mongodb://0.0.0.0:27017';
//mongodb://0.0.0.0:27017

export const client = new MongoClient(DB_URL);

export async function startBD() {
  try {
    await client.connect();
    await client.db('blogs_platform_API').command({ ping: 1 });
    console.log('Connected successfully to mongo server');
  } catch {
    await client.close();
  }
}

const db: mongoDB.Db = client.db(process.env.DB_NAME);
export const BLOGS = db.collection<blogsFieldsType>('blogs');
export const POSTS = db.collection('posts');
