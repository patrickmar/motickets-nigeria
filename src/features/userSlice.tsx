import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Assume this is the unified User interface used across your app
// Unified User interface across the application
interface User {
  id: string;
  email: string;
  image: string | null;
  submerchantId: string | null;
  fullname: string;
  update_flag: string;
  branchId: string;
  accountNo: string;
  city: string | null;
  state: string | null;
  accountName: string;
  dateOfBirth: string | null;
  gender: string | null;
  bank: string;
  bankcode: string;
  bvn: string;
  message: string;
  website?: string; // Optional
  facebook?: string; // Optional
  twitter?: string; // Optional
  instagram?: string; // Optional
  date: string;
  dateCreated: string;
  phone: string | null;
  country: string;
}

// Use the same interface for LoginResponse
// type LoginResponse = User;

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  update_flag: number; // 0 or 1 based on form submission success
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: JSON.parse(
    localStorage.getItem("isAuthenticated") || "false"
  ),
  loading: false,
  update_flag: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.update_flag = parseInt(action.payload.update_flag);
      localStorage.setItem("user", JSON.stringify(action.payload));
      // If there's an image, update the avatar URL in the AvatarContext as well
      if (action.payload.image) {
        localStorage.setItem("avatarUrl", action.payload.image);
        console.log(
          "Avatar URL updated in localStorage:",
          action.payload.image
        );
      }
    },
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
      localStorage.setItem("isAuthenticated", JSON.stringify(action.payload));
    },
    setUpdateFlag(state, action: PayloadAction<number>) {
      if (state.user) {
        state.user.update_flag = action.payload.toString();
      }
      state.update_flag = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.update_flag = 0;
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    },
  },
});

export const {
  setUser,
  setIsAuthenticated,
  setUpdateFlag,
  setLoading,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
