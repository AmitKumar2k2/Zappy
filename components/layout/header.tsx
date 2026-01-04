'use client';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
    const { vendorId, isAuthenticated } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2 font-bold text-lg text-primary">
                    <span>Zappy</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Vendor:</span>
                        <span className="font-medium">{vendorId}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
