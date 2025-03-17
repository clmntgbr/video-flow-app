import { Configuration } from "@/store/interface/configuration";
import { ConfigurationAction } from "./actions";
import { ConfigurationActionTypes } from "./types";

export type ConfigurationState = {
  error: boolean;
  loading: boolean;
  configuration: Configuration;
};

export const initialConfigurationState: ConfigurationState = {
  error: false,
  loading: true,
  configuration: {
    subtitleFont: "ARIAL",
    subtitleSize: "16",
    subtitleColor: "#FFFFFF",
    subtitleBold: "0",
    subtitleItalic: "0",
    subtitleUnderline: "0",
    subtitleOutlineColor: "#000000",
    subtitleOutlineThickness: "OUTLINE_MEDIUM",
    subtitleShadow: "SHADOW_MEDIUM",
    subtitleShadowColor: "#000000",
    format: "ORIGINAL",
    split: "1",
  },
};

export function configurationReducer(state: ConfigurationState, action: ConfigurationActionTypes): ConfigurationState {
  switch (action.type) {
    case ConfigurationAction.CONFIGURATION_LOADING_START: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }

    case ConfigurationAction.CONFIGURATION_LOADING_END: {
      return {
        ...state,
        loading: false,
      };
    }

    case ConfigurationAction.GET_CONFIGURATION_SUCCESS: {
      return {
        ...state,
        configuration: action.payload,
      };
    }

    case ConfigurationAction.GET_CONFIGURATION_ERROR:
    case ConfigurationAction.GET_CONFIGURATION_HTTP_INTERNAL_ERROR:
    case ConfigurationAction.GET_CONFIGURATION_NOT_FOUND: {
      return {
        ...state,
        error: true,
      };
    }

    default:
      return state;
  }
}
