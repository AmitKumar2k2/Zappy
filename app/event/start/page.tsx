'use client';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { setStartOtpInput, incrementStartAttempts, verifyStartSuccess, setEmailInput, submitEmail, backToEmail, resendOtp } from '@/store/slices/startOtpSlice';
import { advanceStep } from '@/store/slices/eventSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, LockKeyhole, RefreshCw, AlertTriangle, Clock } from 'lucide-react';

export default function StartOtpPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { email, step, otp, expectedOtp, otpExpiry, attempts, verified, isLocked } = useAppSelector(state => state.startOtp);
    const { currentStep } = useAppSelector(state => state.event);

    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (currentStep !== 1) {
            router.replace('/dashboard');
        }
    }, [currentStep, router]);

    // Timer logic
    useEffect(() => {
        if (step === 'otp' && otpExpiry) {
            const interval = setInterval(() => {
                const now = Date.now();
                const diff = Math.max(0, Math.ceil((otpExpiry - now) / 1000));
                setTimeLeft(diff);
                if (diff <= 0) {
                    clearInterval(interval);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step, otpExpiry]);

    const handleEmailSubmit = async () => {
        if (!email || !email.includes('@')) {
            dispatch(addToast({ type: 'warning', message: 'Enter a valid email' }));
            return;
        }

        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        dispatch(addToast({ type: 'info', message: 'Sending email...' }));

        try {
            const res = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: newCode }),
            });

            const data = await res.json();

            if (res.ok) {
                dispatch(submitEmail({ otp: newCode }));
                dispatch(addToast({ type: 'success', message: 'Email sent successfully!' }));
            } else {
                // Even if API fails (mock mode), we proceed
                dispatch(submitEmail({ otp: newCode }));
                dispatch(addToast({ type: 'error', message: data.error || 'Failed to send email' }));
            }
        } catch (error) {
            dispatch(submitEmail({ otp: newCode }));
            dispatch(addToast({ type: 'error', message: 'Network error sending email' }));
        }
    };

    const handleVerify = () => {
        if (otp.length !== 6) {
            dispatch(addToast({ type: 'warning', message: 'Enter a 6-digit OTP' }));
            return;
        }

        if (timeLeft <= 0) {
            dispatch(addToast({ type: 'error', message: 'OTP Expired. Please resend.' }));
            return;
        }

        if (otp === expectedOtp) {
            dispatch(verifyStartSuccess());
            dispatch(addToast({ type: 'success', message: 'OTP Verified!' }));
            setTimeout(() => {
                dispatch(advanceStep());
                router.push('/dashboard');
            }, 1000);
        } else {
            dispatch(incrementStartAttempts());
            dispatch(addToast({ type: 'error', message: 'Invalid OTP' }));
        }
    };

    const handleResend = async () => {
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        dispatch(addToast({ type: 'info', message: 'Sending new code...' }));

        try {
            await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: newCode }),
            });
            // Even if API fails (e.g. 500), we proceed for "Mock" experience
            dispatch(resendOtp({ otp: newCode }));
            dispatch(addToast({ type: 'success', message: 'New code sent!' }));
        } catch (error) {
            // Fallback
            dispatch(resendOtp({ otp: newCode }));
            dispatch(addToast({ type: 'warning', message: 'Network error, but mock code generated.' }));
        }
    };

    if (isLocked) {
        return (
            <div className="p-8 space-y-4 text-center mt-10">
                <div className="bg-red-50 p-4 rounded-full inline-block">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-red-600">Verification Locked</h2>
                <p className="text-gray-600">Too many failed attempts (3/3).<br />Please contact Zappy support to unlock.</p>
                <Button variant="outline" onClick={() => router.push('/dashboard')} className="mt-4">Back to Dashboard</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => step === 'otp' ? dispatch(backToEmail()) : router.push('/dashboard')}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <h1 className="text-xl font-bold">Customer Verification</h1>
            </div>

            <Card className="shadow-md border-t-4 border-t-amber-500">
                <CardHeader className="text-center pb-2">
                    <div className="bg-amber-50 p-3 rounded-full h-16 w-16 mx-auto flex items-center justify-center mb-2">
                        <LockKeyhole className="h-8 w-8 text-amber-500" />
                    </div>
                    <CardTitle className="text-lg">
                        {step === 'email' ? 'Enter Customer Email' : 'Enter Start OTP'}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                        {step === 'email'
                            ? 'We will send a one-time password to the customer.'
                            : `Enter the 6-digit code sent to ${email}`
                        }
                    </p>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    {step === 'email' ? (
                        <div className="space-y-4">
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => dispatch(setEmailInput(e.target.value))}
                                placeholder="customer@example.com"
                                className="text-center text-lg"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Prevent default form submission or other effects
                                        handleEmailSubmit();
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4">
                            {/* Mock OTP Display for Testing */}
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-medium border border-blue-200">
                                TEST CODE: {expectedOtp}
                            </div>

                            <Input
                                value={otp}
                                onChange={(e) => dispatch(setStartOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6)))}
                                placeholder="• • • • • •"
                                className="text-center text-3xl tracking-[0.5em] w-64 h-16 font-mono font-bold"
                                type="tel"
                                maxLength={6}
                            />
                            <div className={`flex items-center gap-2 text-sm font-medium ${timeLeft < 10 && timeLeft > 0 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
                                <Clock className="h-4 w-4" />
                                {timeLeft > 0 ? (
                                    <span>Expires in {timeLeft}s</span>
                                ) : (
                                    <span className="text-red-600">Expired</span>
                                )}
                            </div>
                            {attempts > 0 && <p className="text-sm font-medium text-red-500">Attempts left: {3 - attempts}</p>}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    {step === 'email' ? (
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleEmailSubmit}
                            disabled={!email || !email.includes('@')}
                        >
                            Send OTP
                        </Button>
                    ) : (
                        <>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleVerify}
                                disabled={verified || otp.length < 6}
                            >
                                {verified ? 'Verified' : 'Verify Code'}
                            </Button>
                            <Button
                                variant="ghost"
                                className="text-xs text-gray-500"
                                onClick={handleResend}
                                disabled={verified}
                            >
                                <RefreshCw className="h-3 w-3 mr-1" /> Resend OTP
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
