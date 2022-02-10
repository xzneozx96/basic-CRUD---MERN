import { Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import {
  UserEditorPage,
  SignupPage,
  LoginPage,
  DashboardPage,
  ForgotPwPage,
  ResetPwPage,
} from "./pages/index";

function App() {
  return (
    <main>
      <Routes>
        {/* redirect "/" to home page */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-pw" element={<ForgotPwPage />} />
        <Route
          path="/reset-pw/:user_id/:reset_token"
          element={<ResetPwPage />}
        />

        {/* RequireAuth components behaves like a route guard */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/new-user" element={<UserEditorPage />} />
          <Route path="/user/:userID" element={<UserEditorPage />} />
        </Route>

        {/* redirect no-existing routes to home page */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </main>
  );
}

export default App;
