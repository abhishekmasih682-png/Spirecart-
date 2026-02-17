import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { ProductDetail } from './pages/ProductDetail';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { OrderTracking } from './pages/OrderTracking';
import { AddressBook } from './pages/AddressBook';
import { SellerStore } from './pages/SellerStore';
import { SearchResults } from './pages/SearchResults';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
import { CartDrawer } from './components/CartDrawer';
import { MenuDrawer } from './components/MenuDrawer';
import { AIChat } from './components/AIChat';
import { BottomNav } from './components/BottomNav';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MenuProvider>
        <CartProvider>
          <Router>
            <div className="bg-slate-50 min-h-screen text-slate-900 pb-16 md:pb-0">
              <Routes>
                <Route path="/" element={<><Navbar /><Home /><CartDrawer /><MenuDrawer /><AIChat /><BottomNav /></>} />
                <Route path="/orders" element={<><Orders /><MenuDrawer /><BottomNav /></>} />
                <Route path="/profile" element={<><Profile /><MenuDrawer /><BottomNav /></>} />
                <Route path="/profile/addresses" element={<><AddressBook /><MenuDrawer /><BottomNav /></>} />
                <Route path="/settings" element={<><Settings /><MenuDrawer /><BottomNav /></>} />
                <Route path="/wishlist" element={<><Wishlist /><MenuDrawer /><BottomNav /></>} />
                <Route path="/search" element={<><Navbar /><SearchResults /><CartDrawer /><MenuDrawer /><BottomNav /></>} />
                <Route path="/product/:id" element={<><ProductDetail /><CartDrawer /></>} />
                <Route path="/store/:sellerName" element={<><SellerStore /><CartDrawer /></>} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/track-order/:orderId" element={<OrderTracking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </MenuProvider>
    </AuthProvider>
  );
};

export default App;