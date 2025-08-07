// TODO: 장바구니 관리 Hook
// 힌트:
// 1. 장바구니 상태 관리 (localStorage 연동)
// 2. 상품 추가/삭제/수량 변경
// 3. 쿠폰 적용
// 4. 총액 계산
// 5. 재고 확인
//
// 사용할 모델 함수:
// - cartModel.addItemToCart
// - cartModel.removeItemFromCart
// - cartModel.updateCartItemQuantity
// - cartModel.calculateCartTotal
// - cartModel.getRemainingStock
//
// 반환할 값:
// - cart: 장바구니 아이템 배열
// - selectedCoupon: 선택된 쿠폰
// - addToCart: 상품 추가 함수
// - removeFromCart: 상품 제거 함수
// - updateQuantity: 수량 변경 함수
// - applyCoupon: 쿠폰 적용 함수
// - calculateTotal: 총액 계산 함수
// - getRemainingStock: 재고 확인 함수
// - clearCart: 장바구니 비우기 함수

import { useLocalStorage } from '../utils/hooks/useLocalStorage.ts';
import { useCallback, useEffect, useState } from 'react';
import { ProductWithUI } from '../constants';
import { addItemToCart, removeItemFromCart, updateCartItemQuantity } from '../models/cart.ts';
import { CartItem, Coupon } from '../../types.ts';

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const { success, error, cart: newCart } = addItemToCart(cart, product);

      if (success) {
        setCart(newCart!);
        return { success };
        // onAddNotification(result.success.message, 'success');
      }

      if (error) {
        return { error };
      }

      // onAddNotification(result.error.message, 'error');
    },
    [cart, setCart],
  );

  const removeFromCart = (productId: string) => {
    const { cart: newCart } = removeItemFromCart(cart, productId);
    setCart(newCart);
  };

  const updateQuantity = (products: ProductWithUI[], productId: string, newQuantity: number) => {
    const {
      success,
      error,
      cart: newCart,
    } = updateCartItemQuantity(cart, products, productId, newQuantity);

    if (success) {
      setCart(newCart!);
      return { success };
    }

    if (error) {
      return { error };
      // onAddNotification(result.error.message, 'error');
    }
  };

  const clearSelectedCoupon = useCallback(
    (couponCode: string) => {
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
    },
    [selectedCoupon],
  );

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: () => setCart([]),
    clearSelectedCoupon,
  };
}
