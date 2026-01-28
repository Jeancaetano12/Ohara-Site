"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast from '../components/Toast';

type ToastType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  message: string;
  type: ToastType;
  color?: string;
}

interface NotificationContextType {
  notify: (message: string, type?: ToastType, color?: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: ToastType = 'success', color?: string) => {
    const id = Date.now();
    setNotifications((prev) => [{ id, message, type, color }, ...prev]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {/* Container de Toasts - Suporta múltiplas notificações ao mesmo tempo */}
      <div className="fixed top-10 right-1/2 translate-x-1/2 md:right-10 md:translate-x-0 z-100 flex flex-col gap-3">
        {notifications.map((n) => (
          <Toast
            key={n.id}
            message={n.message}
            type={n.type}
            color={n.color}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);