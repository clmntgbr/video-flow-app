import { GetUser } from "@/store/interface/GetUser";
import { UserAction } from "./actions";
import { UserActionTypes } from "./types";

export type UserState = {
  error: boolean;
  loading: boolean;
  me: GetUser | null;
};

export const initialUserState: UserState = {
  error: false,
  loading: true,
  me: null,
};

export function userReducer(state: UserState, action: UserActionTypes): UserState {
  switch (action.type) {
    case UserAction.USER_LOADING_START: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }

    case UserAction.USER_LOADING_END: {
      return {
        ...state,
        loading: false,
      };
    }

    case UserAction.GET_USER_SUCCESS: {
      return {
        ...state,
        me: action.payload,
      };
    }

    case UserAction.GET_USER_NOT_FOUND:
    case UserAction.GET_USER_HTTP_INTERNAL_ERROR:
    case UserAction.GET_USER_ERROR: {
      return {
        ...state,
        error: true,
        me: null,
      };
    }

    default:
      return state;
  }
}
