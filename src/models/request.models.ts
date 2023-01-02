export type requestBodyBlog = {
  name: string,
  description: string,
  websiteUrl: string
};

export type requestBodyPost = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string
};

export type requestBodyPostOfBlog = {
  title: string,
  shortDescription: string,
  content: string
};

export type requestQuery = string;

export type requestQueryAll = {
  searchNameTerm: string,
  pageNumber: string,
  pageSize: string,
  sortBy: string,
  sortDirection:string
};

export type typeBodyID = string;
