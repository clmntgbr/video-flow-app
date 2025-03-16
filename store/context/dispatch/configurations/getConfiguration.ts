import { HttpStatus } from "@/enums/HttpStatus";
import ApiClient from "@/store/client/ApiClient";
import { HttpInternalServerError, HttpNotFoundError } from "@/store/HttpErrors";
import { Configuration } from "@/store/interface/configuration";
import { Dispatch } from "react";
import { ConfigurationAction } from "../../configurations/actions";
import { ConfigurationActionTypes } from "../../configurations/types";

export async function getConfiguration(dispatch: Dispatch<ConfigurationActionTypes>, client: ApiClient): Promise<null | Configuration> {
  try {
    dispatch({ type: ConfigurationAction.CONFIGURATION_LOADING_START });

    const response = await client?.getConfiguration();

    if (response === null || response === undefined) {
      dispatch({
        type: ConfigurationAction.GET_CONFIGURATION_HTTP_INTERNAL_ERROR,
        payload: new HttpInternalServerError("Get plans failed"),
      });
      return null;
    }

    switch (response.status) {
      case HttpStatus.OK:
        dispatch({
          type: ConfigurationAction.GET_CONFIGURATION_SUCCESS,
          payload: response.data as Configuration,
        });
        return response.data;

      case HttpStatus.NOT_FOUND:
        dispatch({
          type: ConfigurationAction.GET_CONFIGURATION_NOT_FOUND,
          payload: new HttpNotFoundError("Get plans not found"),
        });
        return null;

      default:
        dispatch({
          type: ConfigurationAction.GET_CONFIGURATION_HTTP_INTERNAL_ERROR,
          payload: new HttpInternalServerError(`Unexpected status: ${response.status}`),
        });
        return null;
    }
  } catch (error) {
    dispatch({
      type: ConfigurationAction.GET_CONFIGURATION_ERROR,
      payload: error instanceof Error ? error : new Error("Get plans failed"),
    });
    return null;
  } finally {
    dispatch({ type: ConfigurationAction.CONFIGURATION_LOADING_END });
  }
}
