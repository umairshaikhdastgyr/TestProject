import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { logger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

import reducers from "./index";
import rootSaga from "./root-sagas";

const sagaMiddleware = createSagaMiddleware();

// For developmen
require('redux-flipper').default;
// const composedMiddlewares = applyMiddleware(sagaMiddleware, createDebugger());
const composedMiddlewares = applyMiddleware(sagaMiddleware, logger);
// For production
if (__DEV__) {
  applyMiddleware(sagaMiddleware, logger);
}

const storeEnhancers = composeWithDevTools({
  name: "Homitag",
})(composedMiddlewares);

export default function configureStore(initialState) {
  const store = createStore(reducers, initialState, storeEnhancers);
  sagaMiddleware.run(rootSaga);
  return store;
}
