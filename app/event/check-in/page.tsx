'use client';
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { setCheckInData, startCheckIn } from '@/store/slices/checkInSlice';
import { advanceStep } from '@/store/slices/eventSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PhotoUploader } from '@/components/features/PhotoUploader';
import { LocationFetcher } from '@/components/features/LocationFetcher';
import { ArrowLeft } from 'lucide-react';

export default function CheckInPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { photo, latitude, longitude, status } = useAppSelector(state => state.checkIn);
    const { currentStep } = useAppSelector(state => state.event);

    const [localPhoto, setLocalPhoto] = useState<string | null>(photo);
    const [localCoords, setLocalCoords] = useState<{ lat: number, lng: number } | null>(
        latitude && longitude ? { lat: latitude, lng: longitude } : null
    );

    // Guard: only allow if step 0 (or if we are backtracking but logic says 0)
    // Actually, if currentStep > 0, we should maybe look at readonly state?
    // User cannot skip steps. Completed steps are read-only.
    // If step > 0, redirect? Or show read-only? 
    // Plan says "Completed steps are read-only".
    // I'll implement "Read Only" view if currentStep > 0.

    const isReadOnly = currentStep > 0;

    useEffect(() => {
        // If somehow currentStep is 0 but we have data, maybe we just didn't submit?
    }, []);

    const handleSubmit = () => {
        if (!localPhoto || !localCoords) {
            dispatch(addToast({ type: 'error', message: "Please complete all fields" }));
            return;
        }

        dispatch(startCheckIn()); // Set loading

        // Mock API
        setTimeout(() => {
            dispatch(setCheckInData({
                photo: localPhoto,
                lat: localCoords.lat,
                lng: localCoords.lng,
                timestamp: new Date().toISOString()
            }));
            dispatch(advanceStep());
            dispatch(addToast({ type: 'success', message: "Check-in successful!" }));
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <h1 className="text-xl font-bold">Vendor Check-In</h1>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Arrival Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        {isReadOnly ? (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-100">
                                {photo && <img src={photo} alt="Check-in" className="h-full w-full object-cover" />}
                            </div>
                        ) : (
                            <PhotoUploader
                                label="1. Take Arrival Photo"
                                required
                                currentImage={localPhoto}
                                onFileSelect={(f, b64) => setLocalPhoto(b64)}
                            />
                        )}

                        {isReadOnly ? (
                            <div className="p-3 bg-gray-50 rounded border text-sm text-gray-700">
                                Location: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
                            </div>
                        ) : (
                            <LocationFetcher
                                label="2. Confirm Location"
                                currentCoords={localCoords}
                                onLocationFound={(lat, lng) => setLocalCoords({ lat, lng })}
                                onError={(msg) => dispatch(addToast({ type: 'error', message: msg }))}
                            />
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    {!isReadOnly && (
                        <Button
                            className="w-full"
                            size="lg"
                            disabled={!localPhoto || !localCoords || status === 'loading'}
                            onClick={handleSubmit}
                            isLoading={status === 'loading'}
                        >
                            Submit Check-In
                        </Button>
                    )}
                    {isReadOnly && (
                        <div className="w-full text-center text-sm text-green-600 font-medium p-2 bg-green-50 rounded">
                            Check-in Completed
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
