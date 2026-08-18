import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Order from "./pages/Order";
import Activity from "./pages/Activity";
import Account from "./pages/Account";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Signup />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="commande" element={<Order />} />
          <Route path="activite" element={<Activity />} />
          <Route path="compte" element={<Account />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
