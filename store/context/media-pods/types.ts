import { GetMediaPods } from "@/store/interface/GetMediaPods";
import { SetErrorAction, SetHttpInternalServerErrorAction, SetNotFoundErrorAction } from "../ActionErrorTypes";
import { MediaPodAction } from "./actions";

export type SetLoadingStartAction = {
  type: MediaPodAction.MEDIA_PODS_LOADING_START;
};
export type SetLoadingEndAction = {
  type: MediaPodAction.MEDIA_PODS_LOADING_END;
};

/// Get MediaPod

export type GetMediaPodsSuccessAction = {
  type: MediaPodAction.GET_MEDIA_PODS_SUCCESS;
  payload: GetMediaPods;
};
export type GetMediaPodsNotFoundAction = SetNotFoundErrorAction<MediaPodAction.GET_MEDIA_PODS_NOT_FOUND>;
export type GetMediaPodsHttpInternalErrorAction = SetHttpInternalServerErrorAction<MediaPodAction.GET_MEDIA_PODS_HTTP_INTERNAL_ERROR>;
export type GetMediaPodsErrorAction = SetErrorAction<MediaPodAction.GET_MEDIA_PODS_ERROR>;

export type GetRecentsMediaPodsSuccessAction = {
  type: MediaPodAction.GET_RECENTS_MEDIA_PODS_SUCCESS;
  payload: GetMediaPods;
};
export type GetRecentsMediaPodsNotFoundAction = SetNotFoundErrorAction<MediaPodAction.GET_RECENTS_MEDIA_PODS_NOT_FOUND>;
export type GetRecentsMediaPodsHttpInternalErrorAction = SetHttpInternalServerErrorAction<MediaPodAction.GET_RECENTS_MEDIA_PODS_HTTP_INTERNAL_ERROR>;
export type GetRecentsMediaPodsErrorAction = SetErrorAction<MediaPodAction.GET_RECENTS_MEDIA_PODS_ERROR>;

export type MediaPodActionTypes =
  | SetLoadingStartAction
  | SetLoadingEndAction
  | GetMediaPodsSuccessAction
  | GetMediaPodsNotFoundAction
  | GetMediaPodsHttpInternalErrorAction
  | GetMediaPodsErrorAction
  | GetRecentsMediaPodsSuccessAction
  | GetRecentsMediaPodsNotFoundAction
  | GetRecentsMediaPodsHttpInternalErrorAction
  | GetRecentsMediaPodsErrorAction;
