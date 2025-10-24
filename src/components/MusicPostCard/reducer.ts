import type { MusicPostCardState, MusicPostCardAction } from "./types";

export const initialState: MusicPostCardState = {
  isCommentsOpen: false,
};

export const musicPostCardReducer = (
  state: MusicPostCardState,
  action: MusicPostCardAction
): MusicPostCardState => {
  switch (action.type) {
    case "OPEN_COMMENTS":
      return { ...state, isCommentsOpen: true };
    case "CLOSE_COMMENTS":
      return { ...state, isCommentsOpen: false };
    default:
      return state;
  }
};
