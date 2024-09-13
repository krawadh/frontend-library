import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import seatSlice from "./seatSlice";
import membershipSlice from "./membershipSlice";
import memberSlice from "./memberSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// import jobSlice from "./jobSlice";
// import companySlice from "./companySlice";
// import applicationSlice from "./applicationSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  seat: seatSlice,
  membership: membershipSlice,
  member: memberSlice,
  //job: jobSlice,

  //company:companySlice,
  //application:applicationSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store); // Export the persistor
export default store;
