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
  getMySentConnectionRequests, // NEW
} from "../../action/authAction/index";

const initialState = {
  user: null,              // was []
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  loggedIn: false,
  isTokenThere: false,
  connections: [],
  connectionRequest: [],
  outgoingRequests: [],
  connectionUpdating: false,
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => { state.message = "hello"; },
    emptyMessage: (state) => { state.message = ""; },
    setTokenIsThere: (state) => { state.isTokenThere = true; },
    setTokenIsNotThere: (state) => { state.isTokenThere = false; },
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
        state.user = action.payload.user;  // backend returns { message, user }
        state.message = action.payload.message || "login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.loggedIn = false;
        state.message = action.payload?.message || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering user";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;           // FIX (was ==)
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = false;            // remains logged out until login
        state.message = action.payload.message || "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.message || "Registration failed";
      })
      .addCase(getAboutUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching user data";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;       // whatever shape you return
        state.loggedIn = true;             // HYDRATE login on refresh
        state.message = "User data fetched successfully";
      })
      .addCase(getAboutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.loggedIn = false;
        state.user = null;
        state.message = action.payload?.message || "Failed to fetch user data";
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
        state.user = null;
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
        const req = action.payload?.request;
        if (req) {
          if (!Array.isArray(state.outgoingRequests)) state.outgoingRequests = [];
          const exists = state.outgoingRequests.some(r => String(r._id) === String(req._id));
          if (!exists) state.outgoingRequests.push(req);
        }
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
          state.connectionRequest = state.connectionRequest.filter(r => r._id !== updated._id);
          if (updated.status_accepted) {
            if (!Array.isArray(state.connections)) state.connections = [];
            state.connections.push(updated);
          }
          // if this was in my outgoing (edge-case), remove it there too
          state.outgoingRequests = (state.outgoingRequests || []).filter(r => r._id !== updated._id);
        }
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        state.connectionUpdating = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to update request";
      })
      .addCase(getMySentConnectionRequests.pending, (state) => {
        state.message = "Loading sent requests...";
      })
      .addCase(getMySentConnectionRequests.fulfilled, (state, action) => {
        state.outgoingRequests = action.payload?.requests || [];
      })
      .addCase(getMySentConnectionRequests.rejected, (state, action) => {
        state.outgoingRequests = [];
        state.message = action.payload?.message || "Failed to load sent requests";
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