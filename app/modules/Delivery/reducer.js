import { success } from '../utils';

import { GET_DELIVERY_METHODS, CLEAR_DELIVERY } from './constants';

const defaultState = {
  methods: {
    isFetching: true,
    list: [],
  },
  grouped: [
    { id: 'pickup', name: 'Pick Up' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'freeshipping', name: 'Free Shipping' },
  ],
};

const reducer = (state = defaultState, { type, response }) => {
  switch (type) {
    case GET_DELIVERY_METHODS:
      return {
        ...state,
        methods: {
          ...state.methods,
          isFetching: true,
          list: [],
        },
      };
    case success(GET_DELIVERY_METHODS):
      return {
        ...state,
        methods: {
          ...state.methods,
          isFetching: false,
          list: response.data,
        },
      };
    case CLEAR_DELIVERY:
      return {
        ...defaultState,
      };
    default:
      return state;
  }
};

export default reducer;
