import { FETCH_PROFILES } from "../actions/types";

const initialState = {
  items: [],
};

//evaluates what type we are dealing with
export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_PROFILES:
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
}
