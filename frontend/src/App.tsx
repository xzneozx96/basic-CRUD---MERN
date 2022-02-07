import React, { Fragment } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import {
  UserEditorPage,
  SignupPage,
  LoginPage,
  DashboardPage,
} from "./pages/index";

function App() {
  return (
    <Fragment>
      <main>
        <Routes>
          {/* redirect "/" to home page */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/new-user" element={<UserEditorPage />} />
          <Route path="/user/:userID" element={<UserEditorPage />} />

          {/* redirect no-existing routes to home page */}
          <Route path="*" element={<Navigate to="/lgoin" />} />
        </Routes>
      </main>
    </Fragment>
  );
}

export default App;
