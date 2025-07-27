export interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message?: string;
  duration: number;
}
