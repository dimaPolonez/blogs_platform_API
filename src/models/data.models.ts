export type blogsFieldsType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string,
  createdAt: string
}

export type postsFieldsType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string,
  createdAt: string
}

export type responseBlogsType = {
  _id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string,
  createdAt: string
}
