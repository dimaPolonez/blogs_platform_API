import { arrayErrorsFieldsType } from '../models/data.models';

export const ERRORS_CODE: Object = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  NOT_FOUND_404: 404,
};

export let errorsMassages: Object = {
  errorsMassages: arrayErrorsFieldsType,
};
