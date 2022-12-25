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

export type typeBodyID = string;
