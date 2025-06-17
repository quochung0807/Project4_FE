import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Star, 
  BarChart3, 
  Menu, 
  Moon, 
  Sun,
  FolderOpen,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme, user, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Sản phẩm', path: '/admin/products' },
    { icon: FolderOpen, label: 'Danh mục', path: '/admin/categories' },
    { icon: Users, label: 'Người dùng', path: '/admin/users' },
    { icon: ShoppingCart, label: 'Đơn hàng', path: '/admin/orders' },
    { icon: Star, label: 'Đánh giá', path: '/admin/reviews' },
    { icon: BarChart3, label: 'Thống kê', path: '/admin/analytics' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarOpen ? 'w-64' : 'w-16'} bg-card border-r transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        {/* Nút logout dưới cùng sidebar */}
        <div className="p-4 mt-auto">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Đăng xuất</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-card border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
          </h2>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <span className="text-sm font-medium">{user?.username || 'Admin'}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-gray-600 hover:text-orange-500"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
