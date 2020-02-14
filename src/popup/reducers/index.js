import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import items from './itemReducer';
import form from './formReducer';
import history from './historyReducer';
import session from './sessionReducer';
import error from './errorReducer';
import page from './pageReducer';

const rootReducer = combineReducers({
  items,
  form,
  session,
  error,
  history,
  page,
  routing: routerReducer,
});

export default rootReducer;
