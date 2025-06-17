import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./store/StoreProvider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import Deals from "./pages/Deals";
import Brands from "./pages/Brands";
import Contact from "./pages/Contact";
import FlashSale from "./pages/FlashSale";
import NotFound from "./pages/NotFound";

// Admin components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>

            {/* Public Routes */}
            <Route path="/*" element={
              <div className="min-h-screen bg-background">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/cart" element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    } />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/brands" element={<Brands />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/flash-sale" element={<FlashSale />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </StoreProvider>
  </QueryClientProvider>
);

export default App;
