import {errorsFieldsType} from '../models/data.models';

export const ERRORS_CODE = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  NOT_FOUND_404: 404,
};

export const ERRORS_TEXT = {
  OK_200: "Success",
  CREATED_201: "Returns the newly created blog",
  NO_CONTENT_204: "No Content",
  BAD_REQUEST_400: "If the inputModel has incorrect values",
  UNAUTHORIZED_401: "Unauthorized",
  NOT_FOUND_404: "Not Found",
};

export let errorsMassages: {errorsMassages: errorsFieldsType};

