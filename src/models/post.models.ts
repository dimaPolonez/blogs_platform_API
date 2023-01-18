import { ObjectId } from "mongodb";

export type postBDType = {
  _id: ObjectId,
  title: string,
  shortDescription: string,
  content: string,
  blogId: ObjectId,
  blogName: string,
  createdAt: string
  }

export type postReqType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId
  }

export type postOfBlogReqType = {
  title: string,
  shortDescription: string,
  content: string
  }

export type postAllMaps = {
  id: ObjectId,
  title: string,
  shortDescription: string,
  content: string,
  blogId: ObjectId,
  blogName: string,
  createdAt: string
}

export type resultPostObjectType = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: postAllMaps []
}

export type postObjectResult = {
  id: ObjectId,
  title: string,
  shortDescription: string,
  content: string,
  blogId: ObjectId,
  blogName: string,
  createdAt: string
}