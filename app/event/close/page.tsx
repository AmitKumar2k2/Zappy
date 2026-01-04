'use client';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { setClosingOtpInput, incrementClosingAttempts, verifyClosingSuccess, setExpectedClosingOtp } from '@/store/slices/closingOtpSlice';
import { completeEvent } from '@/store/slices/eventSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

export default function CloseEventPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { otp, expectedOtp, attempts, verified, isLocked } = useAppSelector(state => state.closingOtp);
    const { currentStep } = useAppSelector(state => state.event);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Guard: step 3
    useEffect(() => {
        if (currentStep !== 3) {
            router.replace('/dashboard');
        }
    }, [currentStep, router]);

    // Generate Mock OTP
    useEffect(() => {
        if (!expectedOtp) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            dispatch(setExpectedClosingOtp(code));
        }
    }, [expectedOtp, dispatch]);

    const handleVerify = () => {
        if (otp.length !== 6) {
            dispatch(addToast({ type: 'warning', message: 'Enter a 6-digit OTP' }));
            return;
        }

        // Check against dynamic expectedOtp
        if (otp === expectedOtp) {
            dispatch(verifyClosingSuccess());
            dispatch(addToast({ type: 'success', message: 'Event Verified!' }));
            setShowSuccessModal(true);
        } else {
            dispatch(incrementClosingAttempts());
            dispatch(addToast({ type: 'error', message: 'Invalid OTP' }));
        }
    };

    const handleComplete = () => {
        dispatch(completeEvent());
        router.push('/dashboard');
    }

    if (isLocked) {
        return (
            <div className="p-8 text-center mt-10">
                <h2 className="text-xl font-bold text-red-600">Verification Locked</h2>
                <Button variant="outline" onClick={() => router.push('/dashboard')} className="mt-4">Back to Dashboard</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <h1 className="text-xl font-bold">Event Closing</h1>
            </div>

            <Card className="shadow-md border-t-4 border-t-green-500">
                <CardHeader className="text-center pb-2">
                    <div className="bg-green-50 p-3 rounded-full h-16 w-16 mx-auto flex items-center justify-center mb-2">
                        <KeyRound className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">Closing Verification</CardTitle>
                    <p className="text-sm text-gray-500">Enter the closing OTP provided by the customer to finish the event.</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    <div className="flex flex-col items-center space-y-4">
                        {/* Mock OTP Display */}
                        <div className="bg-green-50 text-green-700 px-3 py-1 rounded text-sm font-medium border border-green-200">
                            TEST CODE: {expectedOtp}
                        </div>
                        <Input
                            value={otp}
                            onChange={(e) => dispatch(setClosingOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6)))}
                            placeholder="• • • • • •"
                            className="text-center text-3xl tracking-[0.5em] w-64 h-16 font-mono font-bold"
                            type="tel"
                            maxLength={6}
                        />

                        {attempts > 0 && <p className="text-sm font-medium text-red-500">Attempts left: {3 - attempts}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleVerify}
                        disabled={verified || otp.length < 6}
                    >
                        {verified ? 'Verified' : 'Verify & Close'}
                    </Button>
                </CardFooter>
            </Card>

            <Modal isOpen={showSuccessModal} onClose={() => { }} title="Event Completed">
                <div className="text-center space-y-4 py-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-in zoom-in spin-in-90 duration-500" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Great Job!</h3>
                        <p className="text-gray-500">You have successfully completed this event.</p>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleComplete}>
                        Return to Dashboard
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
