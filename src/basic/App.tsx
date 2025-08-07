import { useState, useCallback } from 'react';
import { ToastType } from '../types';
import AdminPage from './components/AdminPage.tsx';
import CartPage from './components/CartPage.tsx';
import Toast, { Notification } from './components/ui/toast/Toast.tsx';
import { useCart } from './hooks/useCart.ts';
import { useCoupons } from './hooks/useCoupons.ts';
import { useProducts } from './hooks/useProducts.ts';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const {
    cart,
    selectedCoupon,
    clearSelectedCoupon,
    clearCart,
    applyCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { coupons, addCoupon, deleteCoupon } = useCoupons({
    onCouponDeleted: clearSelectedCoupon,
  });
  const { products, deleteProduct, updateProduct, addProduct } = useProducts();

  const addNotification = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

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
          onAddCoupon={addCoupon}
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
          onApplyCoupon={applyCoupon}
          onSelectedCoupon={applyCoupon}
          isAdmin={isAdmin}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onAdminModeChange={setIsAdmin}
          onAddNotification={addNotification}
          onClearCart={clearCart}
        />
      )}
    </div>
  );
};

export default App;
