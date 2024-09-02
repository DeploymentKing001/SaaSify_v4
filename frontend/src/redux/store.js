import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sideBar/sidebarSlice.js';
import authenticationSlice from './sideBar/authenticationSlice.js';
import employeesSlice from './sideBar/employeesSlice.js';
import accountInforSlice from './sideBar/accountInfoSlice.js'
import userSlice from './sideBar/userSlice.js';

const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        user: authenticationSlice,
        employees: employeesSlice,
        businessAccount: accountInforSlice,
        userUltimate: userSlice,
    }
});

export default store;
