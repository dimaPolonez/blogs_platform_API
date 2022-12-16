import { Request } from 'express';


export type RequestBody<T> = Request<{}, {}, T>;
export type RequestQuery<T> = Request<{}, {}, {}, T>;
export type RequestParams<T> = Request<T>;
export type RequestParamsAndBody<P, B> = Request<P, B>;

export type requestId = {
  id: string;
};

export type requestBodyPost = {
  name: string,
  description: string,
  websiteUrl: string
};
