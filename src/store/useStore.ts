import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CartItem, Product, Order, Review } from '../types';
import { authService, LoginData, RegisterData, UserProfile } from '../services/auth';

interface StoreState {
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  
  // Cart
  cart: CartItem[];
  
  // Orders
  orders: Order[];
  
  // Reviews
  reviews: Review[];
  
  // UI State
  theme: 'light' | 'dark';
  isLoading: boolean;
  
  // Actions
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  checkAdminStatus: () => Promise<void>;
  isAdmin: () => boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleTheme: () => void;
  setLoading: (loading: boolean) => void;
  
  // Order actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: number, status: Order['status']) => void;
  
  // Review actions
  addReview: (review: Review) => void;
  
  // Computed
  cartTotal: () => number;
  cartItemsCount: () => number;
  getUserOrders: (userId: number) => Order[];
  getProductReviews: (productId: number) => Review[];
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      role: null,
      cart: [],
      orders: [],
      reviews: [],
      theme: 'light',
      isLoading: false,

      // Actions
      login: async (data) => {
        try {
          const response = await authService.login(data);
          localStorage.setItem('accessToken', response.access);
          localStorage.setItem('refreshToken', response.refresh);
          const profile = await authService.getProfile();
          set({
            user: profile,
            isAuthenticated: true,
            accessToken: response.access,
            refreshToken: response.refresh,
            role: profile.role
          });
        } catch (error) {
          throw error;
        }
      },
      
      register: async (data) => {
        try {
          const registerData = {
            username: data.username,
            email: data.email,
            password: data.password,
            first_name: data.first_name,
            last_name: data.last_name,
            address: data.address,
            phone_number: data.phone_number
          };
          await authService.register(registerData);
          // Không lưu token, user, role vào store/localStorage nữa
        } catch (error) {
          throw error;
        }
      },
      
      logout: () => {
        localStorage.removeItem('ecommerce-store');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.reload();
      },
      
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;
        
        try {
          const response = await authService.refreshToken(refreshToken);
          set({ accessToken: response.access });
          localStorage.setItem('accessToken', response.access);
        } catch (error) {
          get().logout();
        }
      },

      checkAdminStatus: async () => {
        try {
          const isAdmin = await authService.checkIsAdmin();
          set({ role: isAdmin ? 'ADMIN' : 'CUSTOMER' });
        } catch (error) {
          set({ role: 'CUSTOMER' });
        }
      },
      
      isAdmin: () => {
        const { role } = get();
        return role === 'ADMIN';
      },
      
      addToCart: (product, quantity = 1) => {
        const { cart, isAuthenticated } = get();
        if (!isAuthenticated) {
          throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        }
        
        const existingItem = cart.find(item => item.product.id === product.id);
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ cart: [...cart, { product, quantity }] });
        }
      },
      
      removeFromCart: (productId) => {
        const { cart } = get();
        set({ cart: cart.filter(item => item.product.id !== productId) });
      },
      
      updateCartQuantity: (productId, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        set({
          cart: cart.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      clearCart: () => set({ cart: [] }),
      
      toggleTheme: () => {
        const { theme } = get();
        set({ theme: theme === 'light' ? 'dark' : 'light' });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Order actions
      addOrder: (order) => {
        const { orders } = get();
        set({ orders: [...orders, order] });
      },
      
      updateOrderStatus: (orderId, status) => {
        const { orders } = get();
        set({
          orders: orders.map(order =>
            order.id === orderId ? { ...order, status } : order
          )
        });
      },
      
      // Review actions
      addReview: (review) => {
        const { reviews, isAuthenticated } = get();
        if (!isAuthenticated) {
          throw new Error('Vui lòng đăng nhập để đánh giá sản phẩm');
        }
        set({ reviews: [...reviews, review] });
      },
      
      // Computed values
      cartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },
      
      cartItemsCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },
      
      getUserOrders: (userId) => {
        const { orders } = get();
        return orders.filter(order => order.userId === userId);
      },
      
      getProductReviews: (productId) => {
        const { reviews } = get();
        return reviews.filter(review => review.productId === productId);
      }
    }),
    {
      name: 'ecommerce-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        role: state.role,
        cart: state.cart,
        orders: state.orders,
        reviews: state.reviews,
        theme: state.theme
      })
    }
  )
);
