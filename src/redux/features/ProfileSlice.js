import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  phone: "",
  role: "",
  image: "",
};

const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      const { name, email, phone, role, image } = action.payload;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.role = role;
      state.image = image;
    },
  },
});
export const { setProfile } = ProfileSlice.actions;
export default ProfileSlice.reducer;
