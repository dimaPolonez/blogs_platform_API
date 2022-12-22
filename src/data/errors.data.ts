import { errorsFieldsType } from '../models/data.models';

export const ERRORS_CODE = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  NOT_FOUND_404: 404,
  INTERNAL_SERVER_ERROR_500: 500,
};


export let errorsMassages: { errorsMassages: errorsFieldsType };