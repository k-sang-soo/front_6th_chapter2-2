import { atom } from 'jotai';
import { Notification } from '../components/ui/toast/Toast';
import { OperationResult, ToastType } from '../../types';

// 기본 notifications atom
export const notificationsAtom = atom<Notification[]>([]);

// 알림 추가 액션 atom
export const addNotificationAtom = atom(
  null,
  (_get, set, { message, type = 'success' }: { message: string; type?: ToastType }) => {
    const id = Date.now().toString();
    const newNotification: Notification = { id, message, type };

    set(notificationsAtom, (prev) => [...prev, newNotification]);

    // 3초 후 자동 제거
    setTimeout(() => {
      set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  },
);

// 알림 제거 액션 atom
export const hideNotificationAtom = atom(null, (_get, set, id: string) => {
  set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
});

// OperationResult 기반 알림 표시 액션 atom
export const showNotifyFromResultAtom = atom(null, (_get, set, result: OperationResult) => {
  if (result.success) {
    set(addNotificationAtom, {
      message: result.success.message,
      type: 'success',
    });
  }

  if (result.error) {
    set(addNotificationAtom, {
      message: result.error.message,
      type: 'error',
    });
  }
});
