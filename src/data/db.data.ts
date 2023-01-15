import { MongoClient } from 'mongodb';
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';
import {blogsFieldsType, commentsFieldsType, postsFieldsType, usersFieldsType} from "../models/data.models";

dotenv.config();

export const settings = {
  DB_URL: process.env.mongoURI || 'mongodb://0.0.0.0:27017',
  JWT_SECRET: process.env.JWT_SECRET || '123'
}

export const client = new MongoClient(settings.DB_URL);

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
export const POSTS = db.collection<postsFieldsType>('posts');
export const USERS = db.collection<usersFieldsType>('users');
export const COMMENTS = db.collection<commentsFieldsType>('comments');

export const ERRORS_CODE = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  NOT_YOUR_OWN_403: 403,
  NOT_FOUND_404: 404,
  INTERNAL_SERVER_ERROR_500: 500,
};
