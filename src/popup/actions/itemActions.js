import transport from '../../common/transport';
import * as types from '../constants/actionTypes';

export const fetch = () => (dispatch) => (
  transport
    .get('/api/watch')
    .then((items) => {
      dispatch({ type: types.ITEM_LIST_FETCH_SUCCESS, items });
    })
    .catch((error) => {
      dispatch({ type: types.ERROR, error });
    })
);

export const create = (data) => (dispatch) => (
  transport
    .post('/api/watch', data)
    .then((item) => {
      dispatch({ type: types.ITEM_ADD_SUCCESS, item });
    })
    .catch((error) => {
      dispatch({ type: types.ERROR, error });
    })
);

export const remove = (id) => (dispatch) => (
  transport
    .delete(`/api/watch/${id}`)
    .then(() => {
      dispatch({ type: types.ITEM_REMOVE_SUCCESS, id });
    })
    .catch((error) => {
      dispatch({ type: types.ERROR, error });
      throw error;
    })
);

export const removePage = (id, pageId) => (dispatch) => (
  transport
    .delete(`/api/watch/${id}/${pageId}`)
    .then(() => {
      dispatch({ type: types.ITEM_PAGE_REMOVE_SUCCESS, id, pageId });
    })
    .catch((error) => {
      dispatch({ type: types.ERROR, error });
      throw error;
    })
);
