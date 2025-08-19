const { createSlice } = require("@reduxjs/toolkit");
import {
  getAboutUser,
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
  sendConnectionRequest,
  getMyConnectionRequests,
  getMyConnections,
  acceptConnectionRequest,
} from "../../action/authAction/index";

const initialState = {
  user: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  loggedIn: false,
  isTokenThere: false,
  connections: [],
  connectionRequest: [],
  // optional helper flags
  connectionUpdating: false,
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.loggedIn = true;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering user";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading == false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = false;
        state.message = "Registration successful";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getAboutUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching user data";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "User data fetched successfully";
      })
      .addCase(getAboutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload.message || "Failed to fetch user data";
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Logging out";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = false;
        state.user = [];
        state.message = "Logout successful";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload.message || "Failed to logout";
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all users";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.all_users = action.payload.profiles;
        state.all_profiles_fetched = true;
        state.message = "All users fetched successfully";
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.all_profiles_fetched = false;
        state.all_users = [];
        state.message = action.payload.message || "Failed to fetch all users";
      })
      // Send connection
      .addCase(sendConnectionRequest.pending, (state) => {
        state.connectionUpdating = true;
        state.message = "Sending request...";
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.connectionUpdating = false;
        state.isError = false;
        state.message = action.payload?.message || "Request sent";
        // Optional: keep track of my outgoing requests locally
        if (!state.outgoingRequests) state.outgoingRequests = [];
        if (action.payload?.request)
          state.outgoingRequests.push(action.payload.request);
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.connectionUpdating = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to send request";
      })

      // Incoming requests (others -> me)
      .addCase(getMyConnectionRequests.pending, (state) => {
        state.message = "Loading requests...";
      })
      .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
        state.isError = false;
        state.connectionRequest = action.payload?.requests || [];
        state.message = "Requests loaded";
      })
      .addCase(getMyConnectionRequests.rejected, (state, action) => {
        state.isError = true;
        state.connectionRequest = [];
        state.message = action.payload?.message || "Failed to load requests";
      })

      // My accepted connections
      .addCase(getMyConnections.pending, (state) => {
        state.message = "Loading connections...";
      })
      .addCase(getMyConnections.fulfilled, (state, action) => {
        state.isError = false;
        state.connections = action.payload?.connections || [];
        state.message = "Connections loaded";
      })
      .addCase(getMyConnections.rejected, (state, action) => {
        state.isError = true;
        state.connections = [];
        state.message = action.payload?.message || "Failed to load connections";
      })

      // Accept/Reject
      .addCase(acceptConnectionRequest.pending, (state) => {
        state.connectionUpdating = true;
        state.message = "Updating request...";
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.connectionUpdating = false;
        state.isError = false;
        state.message = action.payload?.message || "Request updated";
        const updated = action.payload?.request;
        if (updated) {
          // remove from incoming list
          state.connectionRequest = state.connectionRequest.filter(
            (r) => r._id !== updated._id
          );
          // if accepted, push into connections
          if (updated.status_accepted) {
            if (!Array.isArray(state.connections)) state.connections = [];
            state.connections.push(updated);
          }
        }
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        state.connectionUpdating = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to update request";
      });
  },
});

export const {
  reset,
  emptyMessage,
  setTokenIsThere,
  setTokenIsNotThere,
} = authSlice.actions;
export default authSlice.reducer;