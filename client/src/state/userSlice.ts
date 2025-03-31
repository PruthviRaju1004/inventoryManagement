import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id: number | null;
  email: string;
  roleId: number | null;
  firstName: string;
  lastName: string;
}

const initialState: UserState = {
  id: null,
  email: "",
  roleId: null,
  firstName: "",
  lastName: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, action.payload);
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
