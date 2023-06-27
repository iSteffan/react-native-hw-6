// import { configureStore, combineReducers } from '@reduxjs/toolkit';

// import { authSlice } from './authReducer';

// const rootReducer = combineReducers({
//   [authSlice.name]: authSlice.reducer,
// });

// export const store = configureStore({
//   reducer: rootReducer,
// });
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authSlice } from './authReducer';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
