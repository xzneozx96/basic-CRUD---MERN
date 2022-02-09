import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/api";
import { User } from "../models";

// getAllUsers is just an action (asycn action)
export const getAllUsersAction = createAsyncThunk(
  "users/getAllUsers",
  async () => {
    try {
      const res = await axios.get("/users");
      if (res) {
        const all_users = res.data;
        console.log(all_users);

        return { all_users };
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const addNewUserAction = createAsyncThunk(
  "users/newUser",
  async (user: User) => {
    const new_user = user;

    const res = await axios.post("/users", new_user);
    if (res.data.success) {
      return { new_user };
    }
  }
);

export const updateUserAction = createAsyncThunk(
  "users/updateUser",
  async (payload: { userID: string | undefined; updated_user: User }) => {
    const { userID, updated_user } = payload;

    const res = await axios.put(`/users/${userID}`, updated_user);
    if (res.data.success) {
      return { updated_user };
    }
  }
);

export const deleteUserAction = createAsyncThunk(
  "users/deleteUser",
  async (id: string | undefined) => {
    const res = await axios.delete(`users/${id}`);
    if (res.data.success) {
      return { id };
    }
  }
);

const initialUserState: User[] = [];

const usersSlice = createSlice({
  name: "Users",
  initialState: initialUserState,

  // below includes reducers that handle sync action
  reducers: {},

  // below includes reducers that handle async action
  extraReducers: (builder) => {
    builder.addCase(getAllUsersAction.pending, (state, action) => {
      // we can show loading spinner here
      console.log("fetching users ...");
    });

    builder.addCase(getAllUsersAction.fulfilled, (state, action) => {
      return action.payload?.all_users;
    });

    builder.addCase(addNewUserAction.fulfilled, (state, action) => {
      const new_state = [...state, action.payload!.new_user];
      return new_state;
    });

    builder.addCase(deleteUserAction.fulfilled, (state, action) => {
      const updated_users = state.filter(
        (user: User) => user.id !== action.payload!.id
      );
      return updated_users;
    });
  },
});

export const usersActions = usersSlice.actions;
export const usersReducers = usersSlice.reducer;
