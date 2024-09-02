import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: { isVisible: false },
    reducers: {
        toggleSidebar(state) {
            state.isVisible = !state.isVisible;
        },
        showSidebar(state) {
            state.isVisible = true;
        },
        hideSidebar(state) {
            state.isVisible = false;
        }
    }
});

export const { toggleSidebar, showSidebar, hideSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
