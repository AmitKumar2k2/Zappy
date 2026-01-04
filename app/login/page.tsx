'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Lock, User } from 'lucide-react';
import { addToast } from '@/store/slices/uiSlice';

export default function LoginPage() {
    const [vendorId, setVendorId] = useState('VEN-123456');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock API call
        setTimeout(() => {
            if (password === 'password') {
                dispatch(login({ vendorId, token: 'mock-token-xyz' }));
                dispatch(addToast({ type: 'success', message: `Welcome back, ${vendorId}` }));
                router.push('/dashboard');
            } else {
                dispatch(addToast({ type: 'error', message: 'Invalid credentials. Try "password"' }));
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary animate-in fade-in zoom-in-95 duration-300">
            <CardHeader className="space-y-1 text-center pb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Vendor Login</h1>
                <p className="text-gray-500">Enter your credentials to access today's event</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <Input
                                value={vendorId}
                                onChange={(e) => setVendorId(e.target.value)}
                                placeholder="Vendor ID"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full mt-4" size="lg" isLoading={loading}>
                        Sign In
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 text-center text-xs text-gray-400 bg-gray-50/50 rounded-b-lg p-4">
                <p>Mock Credentials: ID: Any, Pass: password</p>
            </CardFooter>
        </Card>
    );
}
