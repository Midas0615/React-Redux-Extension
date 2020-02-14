import transport from '../../common/transport';
import * as types from '../constants/actionTypes';

export const fetch = (data) => (dispatch) => ( // eslint-disable-line import/prefer-default-export
  transport
    .post('/api/page', data)
    .then((page) => {
      dispatch({ type: types.PAGE_FETCH_SUCCESS, page });
    })
    .catch((error) => {
      dispatch({ type: types.ERROR, error });
    })
);
