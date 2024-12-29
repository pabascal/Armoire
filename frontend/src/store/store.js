import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user'; // Import the userSlice reducer

const store = configureStore({
  reducer: {
    user: userReducer, 
  },
});

export default store;