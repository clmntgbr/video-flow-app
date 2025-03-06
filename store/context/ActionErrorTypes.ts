import { HttpInternalServerError, HttpNotFoundError, HttpValidationError } from "../HttpErrors";

export type SetHttpInternalServerErrorAction<T> = {
  type: T;
  payload: HttpInternalServerError;
};

export type SetNotFoundErrorAction<T> = {
  type: T;
  payload: HttpNotFoundError;
};

export type SetValidationErrorAction<T> = {
  type: T;
  payload: HttpValidationError;
};

export type SetErrorAction<T> = {
  type: T;
  payload: Error;
};
