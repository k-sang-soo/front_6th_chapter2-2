import { useState, useCallback, useEffect } from 'react';
import { CartItem, Coupon, ToastType } from '../types';
import { initialCoupons, initialProducts, ProductWithUI } from './constants';
import Toast, { Notification } from './components/ui/Toast.tsx';
import AdminPage from './components/AdminPage.tsx';
import CartPage from './components/CartPage.tsx';

const App = () => {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleAddCoupon = (newCoupon: Coupon) => {
    const exists = coupons.find((c) => c.code === newCoupon.code);
    if (exists) {
      return false;
    }

    setCoupons((prev) => [...prev, newCoupon]);
    return true;
  };

  const addNotification = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)),
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification],
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast
        notifications={notifications}
        onRemove={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
      />

      {isAdmin ? (
        <AdminPage
          products={products}
          coupons={coupons}
          cart={cart}
          isAdmin={isAdmin}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          onAddCoupon={handleAddCoupon}
          onDeleteCoupon={deleteCoupon}
          onAdminModeChange={setIsAdmin}
          onAddNotification={addNotification}
        />
      ) : (
        <CartPage
          products={products}
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          onSelectedCoupon={setSelectedCoupon}
          isAdmin={isAdmin}
          onUpdateCart={setCart}
          onAdminModeChange={setIsAdmin}
          onAddNotification={addNotification}
        />
      )}
    </div>
  );
};

export default App;
