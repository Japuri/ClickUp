import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import ProjectDetail from "./screens/ProjectDetail";
import ProjectCreate from "./screens/ProjectCreate";
import TaskCreate from "./screens/TaskCreate";
import UserList from "./screens/UserList";
import UserCreate from "./screens/UserCreate";
import { setUser } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/create"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ProjectCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id/task/create"
              element={
                <ProtectedRoute allowedRoles={["admin", "manager"]}>
                  <TaskCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/create"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserCreate />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
