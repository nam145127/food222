import { BrowserRouter, Routes, Route, Navigate, HashRouter  } from "react-router-dom"
import { Toaster } from "sonner"

import Login from "./pages/Login"
import Dashboard from "./pages/admin/Dashboard"
import Users from "./pages/admin/Users"
import Categories from "./pages/admin/CategoriesPage"
import Foods from "./pages/admin/FoodPage"
import AboutPage from "./pages/AboutPage"
import FoodsPage from "./pages/Foods"
import FoodsDetail from "./pages/FoodDetail"
import Home from "./pages/Home"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import MyOrders from "./pages/MyOrders"
import Contact from "./pages/Contact"
import ProfilePage from "./pages/ProfilePage";
import AdminOrders from "./pages/admin/Orders";
import AdminContacts from "./pages/admin/Contacts"

import AdminLayout from "./components/AdminLayout"

function App() {

  return (

    <HashRouter>

      {/* TOAST */}
      <Toaster
        position="bottom-right"
        richColors
        expand
        toastOptions={{
          style: {
            maxWidth: "360px"
          }
        }}
      />

      <Routes>

        {/* DEFAULT */}
        <Route
          path="/"
          element={<Navigate to="/home" />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* USER */}
        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/food"
          element={<FoodsPage />}
        />
        <Route
          path="/foods/:id"
          element={<FoodsDetail />}
        />

        <Route
          path="/cart"
          element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/my-orders" element={<MyOrders />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/profile" element={<ProfilePage />} />




        {/* ADMIN */}
        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="users"
            element={<Users />}
          />

          <Route
            path="categories"
            element={<Categories />}
          />

          <Route
            path="foods"
            element={<Foods />}
          />

          <Route
            path="orders"
            element={<AdminOrders />} />

          <Route
            path="contacts"
            element={<AdminContacts />}
          />

        </Route>

        {/* NOT FOUND */}
        <Route
          path="*"
          element={<Navigate to="/home" />}
        />

      </Routes>

    </HashRouter>

  )

}

export default App
