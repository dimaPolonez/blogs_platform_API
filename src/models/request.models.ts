import {ObjectId} from "mongodb";

export type requestBodyBlog = {
  name: string,
  description: string,
  websiteUrl: string
};

export type requestBodyPost = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: ObjectId
};

export type requestBodyPostOfBlog = {
  title: string,
  shortDescription: string,
  content: string
};

export type requestQuery = string;

export type requestQuerySearch = string | object;

export type requestQueryAll = {
  searchNameTerm: string | object,
  pageNumber: string,
  pageSize: string,
  sortBy: string,
  sortDirection:string
};

export type typeBodyID = ObjectId;
