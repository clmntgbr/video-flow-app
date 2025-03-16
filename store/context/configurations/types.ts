import { Configuration } from "@/store/interface/configuration";
import { SetErrorAction, SetHttpInternalServerErrorAction, SetNotFoundErrorAction } from "../ActionErrorTypes";
import { ConfigurationAction } from "./actions";

export type SetLoadingStartAction = {
  type: ConfigurationAction.CONFIGURATION_LOADING_START;
};
export type SetLoadingEndAction = {
  type: ConfigurationAction.CONFIGURATION_LOADING_END;
};

/// Get Configuration

export type GetConfigurationsSuccessAction = {
  type: ConfigurationAction.GET_CONFIGURATION_SUCCESS;
  payload: Configuration;
};
export type GetConfigurationsNotFoundAction = SetNotFoundErrorAction<ConfigurationAction.GET_CONFIGURATION_NOT_FOUND>;
export type GetConfigurationsHttpInternalErrorAction = SetHttpInternalServerErrorAction<ConfigurationAction.GET_CONFIGURATION_HTTP_INTERNAL_ERROR>;
export type GetConfigurationsErrorAction = SetErrorAction<ConfigurationAction.GET_CONFIGURATION_ERROR>;

export type ConfigurationActionTypes =
  | SetLoadingStartAction
  | SetLoadingEndAction
  | GetConfigurationsSuccessAction
  | GetConfigurationsNotFoundAction
  | GetConfigurationsHttpInternalErrorAction
  | GetConfigurationsErrorAction;
