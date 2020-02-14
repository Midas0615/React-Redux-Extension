import * as identity from '../../common/identity';
import * as types from '../constants/actionTypes';

export const restore = () => (dispatch) => (
  identity
    .silent()
    .then((session) => dispatch({ type: types.SESSION_RESTORE_SUCCESS, session }))
    .catch((error) => dispatch({ type: types.ERROR, error }))
);

export const login = (network) => (dispatch) => (
  identity
    .login(network)
    .then((session) => dispatch({ type: types.SESSION_LOGIN_SUCCESS, session }))
    .catch((error) => dispatch({ type: types.ERROR, error }))
);

export const logout = () => (dispatch) => (
  identity
    .logout()
    .then(() => dispatch({ type: types.SESSION_LOGOUT_SUCCESS }))
);

