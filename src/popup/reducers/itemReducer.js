import * as types from '../constants/actionTypes';
import initialState from './initialState';

const removePage = (state, action) => {
  const item = state.find(i => i._id === action.id); // eslint-disable-line no-underscore-dangle
  item.pages = item.pages.filter(p => p._id !== action.pageId); // eslint-disable-line no-underscore-dangle
  item.prices = item.prices.filter(p => p.page !== action.pageId); // eslint-disable-line no-underscore-dangle
  item.history = item.history.filter(p => p._id !== action.pageId); // eslint-disable-line no-underscore-dangle

  return state;
};

export default function (state = initialState.items, action) {
  switch (action.type) {
    case types.ITEM_LIST_FETCH_SUCCESS:
      return action.items.sort((l, r) => {
        if (l.notification || r.notification) return 1;

        return 0;
      });

    case types.ITEM_ADD_SUCCESS:
      return [...state];

    case types.ITEM_REMOVE_SUCCESS:
      return [
        ...state.filter(item => item._id !== action.id), // eslint-disable-line no-underscore-dangle
      ];

    case types.ITEM_PAGE_REMOVE_SUCCESS:
      return [...removePage(state, action)];

    default:
      return state;
  }
}
