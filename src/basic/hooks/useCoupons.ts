// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { useLocalStorage } from '../utils/hooks/useLocalStorage.ts';
import { initialCoupons } from '../constants';
import { useCallback, useEffect } from 'react';
import { Coupon } from '../../types.ts';

interface useCouponsProps {
  onCouponDeleted: (couponCode: string) => void;
}

export function useCoupons({ onCouponDeleted }: useCouponsProps) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = (newCoupon: Coupon) => {
    const exists = coupons.find((c) => c.code === newCoupon.code);
    if (exists) {
      return {
        error: {
          type: '',
          message: '이미 존재하는 쿠폰 코드입니다.',
        },
      };
    }

    const newCoupons = [...coupons, newCoupon];
    setCoupons(newCoupons);
    return {
      success: {
        type: '',
        message: '쿠폰이 추가되었습니다.',
      },
    };
  };

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      const newCoupons = coupons.filter((c) => c.code !== couponCode);
      setCoupons(newCoupons);
      onCouponDeleted(couponCode);
      return {
        success: {
          type: '',
          message: '쿠폰이 삭제되었습니다.',
        },
      };
    },
    [coupons, onCouponDeleted, setCoupons],
  );

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
}
