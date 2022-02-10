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

        return { all_users };
      }
    } catch (err: any) {
      console.log(err.response.data.msg);
    }
  }
);

export const addNewUserAction = createAsyncThunk(
  "users/newUser",
  async (user: User, { rejectWithValue }) => {
    try {
      const new_user = user;
      await axios.post("/users", new_user);
      return { new_user };
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const updateUserAction = createAsyncThunk(
  "users/updateUser",
  async (
    payload: { userID: string | undefined; updated_user: User },
    { rejectWithValue }
  ) => {
    try {
      const { userID, updated_user } = payload;
      await axios.put(`/users/${userID}`, updated_user);
      return { updated_user };
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
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

const initialUserState: {
  users: User[];
} = { users: [] };

const usersSlice = createSlice({
  name: "Users",
  initialState: initialUserState,

  // below includes reducers that handle sync actions
  reducers: {
    addUser(state, action) {},
  },

  // below includes reducers that handle async actions
  extraReducers: (builder) => {
    builder.addCase(getAllUsersAction.pending, () => {
      // we can show loading spinner here
      // console.log("fetching users ...");
    });

    builder.addCase(getAllUsersAction.fulfilled, (state, action) => {
      state.users = action.payload!.all_users;
    });

    // handle add new user action
    builder.addCase(addNewUserAction.fulfilled, (state, action) => {
      state.users.push(action.payload!.new_user);
    });

    // handle delete user action
    builder.addCase(deleteUserAction.fulfilled, (state, action) => {
      const updated_users = state.users.filter(
        (user: User) => user.id !== action.payload!.id
      );
      state.users = updated_users;
    });
  },
});

export const usersActions = usersSlice.actions;
export const usersReducers = usersSlice.reducer;
