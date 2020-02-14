import transport from '../../common/transport';
import * as types from '../constants/actionTypes';

export const fetch = (pages) => (dispatch) => ( // eslint-disable-line import/prefer-default-export
  transport
    .post('/api/history', { pages })
    .then((history) => {
      dispatch({ type: types.HISTORY_FETCH_SUCCESS, history });
    })
    .catch((error) => {
      dispatch({ type: types.ERROR, error });
    })
);

