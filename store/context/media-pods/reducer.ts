import { GetMediaPods } from "@/store/interface/GetMediaPods";
import { MediaPodAction } from "./actions";
import { MediaPodActionTypes } from "./types";

export type MediaPodState = {
  error: boolean;
  loading: boolean;
  all: GetMediaPods | [];
  recents: GetMediaPods | [];
};

export const initialMediaPodState: MediaPodState = {
  error: false,
  loading: true,
  all: [],
  recents: [],
};

export function mediaPodReducer(state: MediaPodState, action: MediaPodActionTypes): MediaPodState {
  switch (action.type) {
    case MediaPodAction.MEDIA_PODS_LOADING_START: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }

    case MediaPodAction.MEDIA_PODS_LOADING_END: {
      return {
        ...state,
        loading: false,
      };
    }

    case MediaPodAction.GET_MEDIA_PODS_SUCCESS: {
      return {
        ...state,
        all: action.payload,
      };
    }

    case MediaPodAction.GET_RECENTS_MEDIA_PODS_SUCCESS: {
      return {
        ...state,
        recents: action.payload,
      };
    }

    case MediaPodAction.GET_MEDIA_PODS_NOT_FOUND:
    case MediaPodAction.GET_MEDIA_PODS_HTTP_INTERNAL_ERROR:
    case MediaPodAction.GET_MEDIA_PODS_ERROR: {
      return {
        ...state,
        error: true,
        all: [],
      };
    }

    default:
      return state;
  }
}
