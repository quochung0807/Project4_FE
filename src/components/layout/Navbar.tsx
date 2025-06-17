import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Heart, Menu, MapPin, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, user, isAuthenticated, logout } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Sản phẩm', path: '/products' },
    { name: 'Khuyến mãi', path: '/deals' },
    { name: 'Thương hiệu', path: '/brands' },
    { name: 'Liên hệ', path: '/contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>Giao hàng toàn quốc</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Hotline: 1900 1234</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/seller" className="text-gray-600 hover:text-orange-500">
                Bán hàng cùng Elecxo
              </Link>
              <span className="text-gray-400">|</span>
              <Link to="/help" className="text-gray-600 hover:text-orange-500">
                Hỗ trợ
              </Link>
              <span className="text-gray-400">|</span>
              <Link to="/download" className="text-gray-600 hover:text-orange-500">
                Tải ứng dụng
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Elecxo</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                  className="w-full px-4 py-3 pr-12 border-2 border-orange-500 rounded-lg focus:outline-none focus:border-orange-600 text-sm"
                />
                <Button 
                  size="sm" 
                  className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 px-4 rounded-md"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-6">
              {/* Search Icon - Mobile */}
              <Button variant="ghost" size="icon" className="md:hidden text-gray-600 hover:text-orange-500">
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-orange-500">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-orange-500">
                <Heart className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-orange-500" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500 hover:bg-orange-600"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* User Account */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" asChild className="text-gray-600 hover:text-orange-500">
                    <Link to="/profile">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                  <div className="hidden lg:flex items-center space-x-2">
                    <div>
                      <span className="text-sm text-gray-600">Xin chào,</span>
                      <div className="text-sm font-medium text-gray-900">{user?.username || 'User'}</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-orange-500"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/register" className="text-sm text-gray-600 hover:text-orange-500">
                    Đăng ký
                  </Link>
                  <span className="text-gray-400">|</span>
                  <Link to="/login" className="text-sm text-gray-600 hover:text-orange-500">
                    Đăng nhập
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden text-gray-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8 py-3 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                  location.pathname === link.path
                    ? 'text-orange-500'
                    : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <span className="text-gray-400">|</span>
            <Link to="/flash-sale" className="text-sm font-medium text-red-500 hover:text-red-600">
              ⚡ Flash Sale
            </Link>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                      location.pathname === link.path
                        ? 'text-orange-500'
                        : 'text-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              
              {/* Mobile Search */}
              <div className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full px-4 py-3 pr-12 border-2 border-orange-500 rounded-lg focus:outline-none focus:border-orange-600 text-sm"
                  />
                  <Button 
                    size="sm" 
                    className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 px-4 rounded-md"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
