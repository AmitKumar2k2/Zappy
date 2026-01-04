'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeToast } from '@/store/slices/uiSlice';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Toaster() {
    const toasts = useAppSelector((state) => state.ui.toasts);
    const dispatch = useAppDispatch();

    useEffect(() => {
        toasts.forEach((toast) => {
            if (toast.duration !== Infinity) {
                const timer = setTimeout(() => {
                    dispatch(removeToast(toast.id));
                }, toast.duration || 3000);
                // Cleanup tricky in loop, but acceptable for simple toast
            }
        });
    }, [toasts, dispatch]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 md:px-0">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "flex items-center gap-3 rounded-lg p-4 shadow-lg transition-all animate-in slide-in-from-right-full border",
                        toast.type === 'success' && "bg-green-50 text-green-900 border-green-200",
                        toast.type === 'error' && "bg-red-50 text-red-900 border-red-200",
                        toast.type === 'warning' && "bg-amber-50 text-amber-900 border-amber-200",
                        toast.type === 'info' && "bg-blue-50 text-blue-900 border-blue-200"
                    )}
                >
                    {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />}
                    {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />}
                    {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />}
                    {toast.type === 'info' && <Info className="h-5 w-5 text-blue-600 shrink-0" />}

                    <p className="flex-1 text-sm font-medium">{toast.message}</p>

                    <button onClick={() => dispatch(removeToast(toast.id))} className="text-gray-500 hover:text-gray-700">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
