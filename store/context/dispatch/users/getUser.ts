import { HttpStatus } from "@/enums/HttpStatus";
import ApiClient from "@/store/client/ApiClient";
import { HttpInternalServerError, HttpNotFoundError } from "@/store/HttpErrors";
import { GetUser } from "@/store/interface/GetUser";
import { Dispatch } from "react";
import { UserAction } from "../../users/actions";
import { UserActionTypes } from "../../users/types";

export async function getUser(dispatch: Dispatch<UserActionTypes>, client: ApiClient): Promise<null | GetUser> {
  try {
    dispatch({ type: UserAction.USER_LOADING_START });

    const response = await client?.getUser();

    if (response === null || response === undefined) {
      dispatch({
        type: UserAction.GET_USER_HTTP_INTERNAL_ERROR,
        payload: new HttpInternalServerError("Get plans failed"),
      });
      return null;
    }

    switch (response.status) {
      case HttpStatus.OK:
        dispatch({
          type: UserAction.GET_USER_SUCCESS,
          payload: response.data as GetUser,
        });
        return response.data;

      case HttpStatus.NOT_FOUND:
        dispatch({
          type: UserAction.GET_USER_NOT_FOUND,
          payload: new HttpNotFoundError("Get plans not found"),
        });
        return null;

      default:
        dispatch({
          type: UserAction.GET_USER_HTTP_INTERNAL_ERROR,
          payload: new HttpInternalServerError(`Unexpected status: ${response.status}`),
        });
        return null;
    }
  } catch (error) {
    dispatch({
      type: UserAction.GET_USER_ERROR,
      payload: error instanceof Error ? error : new Error("Get plans failed"),
    });
    return null;
  } finally {
    dispatch({ type: UserAction.USER_LOADING_END });
  }
}
