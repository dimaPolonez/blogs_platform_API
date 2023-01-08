import {ObjectId} from "mongodb";

export type requestBodyBlog = {
  name: string,
  description: string,
  websiteUrl: string
};

export type requestBodyUser = {
  login: string,
  password: string,
  email: string
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

export type requestQuerySearch = string;

export type requestQueryAll = {
  searchNameTerm: string,
  pageNumber: string,
  pageSize: string,
  sortBy: string,
  sortDirection:string
};

export type typeBodyID = ObjectId;

export type requestQueryUser = {
  sortBy: string,
  sortDirection: string,
  pageNumber: string,
  pageSize: string,
  searchLoginTerm: string,
  searchEmailTerm: string
}

export type queryAllUser = {
  sortBy: string,
  sortDirection: string,
  pageNumber: number,
  pageSize: number,
  searchLoginTerm: string,
  searchEmailTerm: string
}


export type queryAuthUser = {
  loginOrEmail: string,
  password: string
}
