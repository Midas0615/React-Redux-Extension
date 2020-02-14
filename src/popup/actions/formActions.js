import transport from '../../common/transport';
import * as types from '../constants/actionTypes';

export const restore = () => (dispatch) => (
  transport
    .post('/browser/page/restore')
    .then((form) => {
      dispatch({ type: types.FORM_RESTORE_SUCCESS, form });
    })
    .catch(() => {
      dispatch({ type: types.FORM_RESTORE_FAILED });
    })
);

export const detect = (data) => (dispatch) => (
  transport
    .post('/browser/page/autodetect', data)
    .then((form) => {
      dispatch({ type: types.FORM_AUTO_DETECT_SUCCESS, form });
    })
    .catch((error) => {
      dispatch({ type: types.FORM_AUTO_DETECT_FAILED });
      throw error; // throw error to chain
    })
);

export const reset = () => (dispatch) => (
  transport
    .post('/browser/page/reset')
    .then(() => {
      dispatch({ type: types.FORM_RESET_SUCCESS });
    })
    .catch(() => {
      dispatch({ type: types.FORM_RESET_FAILED });
    })
);

