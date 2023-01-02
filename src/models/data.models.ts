import {ObjectId} from "mongodb";

export type blogsFieldsType = {
  _id: ObjectId,
  name: string;
  description: string;
  websiteUrl: string,
  createdAt: string
}

export type postsFieldsType = {
  _id: ObjectId,
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string,
  createdAt: string
}

export type responseBlogsType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string,
  createdAt: string
}
