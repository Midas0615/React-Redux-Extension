import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState.form, action) {
  switch (action.type) {
    case types.FORM_RESTORE_SUCCESS:
    case types.FORM_AUTO_DETECT_SUCCESS:
      return action.form;

    case types.FORM_RESET_SUCCESS:
    case types.FORM_RESET_FAILED:
    case types.FORM_RESTORE_FAILED:
    case types.FORM_AUTO_DETECT_FAILED:
      return initialState.form;

    default:
      return state;
  }
}
