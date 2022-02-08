import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import {
  UserEditorPage,
  SignupPage,
  LoginPage,
  DashboardPage,
} from "./pages/index";
import { RootState } from "./redux/app-redux";

function App() {
  const is_logged_in = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <main>
      <Routes>
        {/* redirect "/" to home page */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {is_logged_in && (
          <Route path="/dashboard" element={<DashboardPage />} />
        )}
        {is_logged_in && (
          <Route path="/new-user" element={<UserEditorPage />} />
        )}
        {is_logged_in && (
          <Route path="/user/:userID" element={<UserEditorPage />} />
        )}

        {/* redirect no-existing routes to home page */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </main>
  );
}

export default App;
