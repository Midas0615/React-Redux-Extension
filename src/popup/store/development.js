import {
  createStore,
  compose,
  applyMiddleware,
} from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'; // eslint-disable-line import/no-extraneous-dependencies
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  const middewares = [
    reduxImmutableStateInvariant(),
    thunkMiddleware,
  ];

  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middewares),
    )
  );

  return store;
}
