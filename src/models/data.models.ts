import { ObjectId } from 'mongodb';

export interface blogsFieldsType {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
}

export interface postsFieldsType {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
}

export type errorsFieldsType = [{ message: string; field: string }];
