import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Items from "./pages/Items";
import ItemDetail from "./pages/ItemDetail";
import PostItem from "./pages/PostItem";
import Dashboard from "./pages/Dashboard";
import MyPosts from "./pages/MyPosts";
import MyClaims from "./pages/MyClaims";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminItems from "./pages/admin/AdminItems";
import AdminReports from "./pages/admin/AdminReports";
import ClaimsReceived from "./pages/ClaimsReceived";
import EditItem from "./pages/EditItem";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/items/:id/edit" element={<EditItem />} />
        <Route path="/post/lost" element={<PostItem type="lost" />} />
        <Route path="/post/found" element={<PostItem type="found" />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-posts"
  element={
    <ProtectedRoute>
      <MyPosts />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-claims"
  element={
    <ProtectedRoute>
      <MyClaims />
    </ProtectedRoute>
  }
/>
        <Route
  path="/admin/users"
  element={
    <ProtectedRoute adminOnly>
      <AdminUsers />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/items"
  element={
    <ProtectedRoute adminOnly>
      <AdminItems />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reports"
  element={
    <ProtectedRoute adminOnly>
      <AdminReports />
    </ProtectedRoute>
  }
/>
  <Route
  path="/claims-received"
  element={
    <ProtectedRoute>
      <ClaimsReceived />
    </ProtectedRoute>
  }
  />
        
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;