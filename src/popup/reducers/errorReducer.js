import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState.error, action) {
  switch (action.type) {
    case types.ERROR:
      return {
        name: action.error.name,
        message: action.error.message,
        statusCode: action.error.statusCode,
      };

    default:
      return initialState.error;
  }
}
