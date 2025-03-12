import { HttpStatus } from "@/enums/HttpStatus";
import ApiClient from "@/store/client/ApiClient";
import { HttpInternalServerError, HttpNotFoundError } from "@/store/HttpErrors";
import { GetMediaPods } from "@/store/interface/GetMediaPods";
import { Dispatch } from "react";
import { MediaPodAction } from "../../media-pods/actions";
import { MediaPodActionTypes } from "../../media-pods/types";

export async function getMediaPods(dispatch: Dispatch<MediaPodActionTypes>, client: ApiClient): Promise<null | GetMediaPods> {
  try {
    dispatch({ type: MediaPodAction.MEDIA_PODS_LOADING_START });

    const response = await client?.getMediaPods();

    if (response === null || response === undefined) {
      dispatch({
        type: MediaPodAction.GET_MEDIA_PODS_HTTP_INTERNAL_ERROR,
        payload: new HttpInternalServerError("Get plans failed"),
      });
      return null;
    }

    switch (response.status) {
      case HttpStatus.OK:
        dispatch({
          type: MediaPodAction.GET_MEDIA_PODS_SUCCESS,
          payload: response.data as GetMediaPods,
        });
        return response.data;

      case HttpStatus.NOT_FOUND:
        dispatch({
          type: MediaPodAction.GET_MEDIA_PODS_NOT_FOUND,
          payload: new HttpNotFoundError("Get plans not found"),
        });
        return null;

      default:
        dispatch({
          type: MediaPodAction.GET_MEDIA_PODS_HTTP_INTERNAL_ERROR,
          payload: new HttpInternalServerError(`Unexpected status: ${response.status}`),
        });
        return null;
    }
  } catch (error) {
    dispatch({
      type: MediaPodAction.GET_MEDIA_PODS_ERROR,
      payload: error instanceof Error ? error : new Error("Get plans failed"),
    });
    return null;
  } finally {
    dispatch({ type: MediaPodAction.MEDIA_PODS_LOADING_END });
  }
}
