'use client';
import { Button } from "@/components/ui/button";
import { MapPin, Check, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface LocationFetcherProps {
    onLocationFound: (lat: number, lng: number) => void;
    onError?: (error: string) => void;
    label?: string;
    currentCoords?: { lat: number; lng: number } | null;
}

export function LocationFetcher({ onLocationFound, onError, label = "Get Current Location", currentCoords }: LocationFetcherProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(currentCoords || null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setStatus('error');
            onError?.("Geolocation not supported");
            return;
        }

        setStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lng: longitude });
                setStatus('success');
                onLocationFound(latitude, longitude);
            },
            (error) => {
                setStatus('error');
                let msg = "Failed to get location";
                if (error.code === 1) msg = "Location permission denied"; // PERMISSION_DENIED
                onError?.(msg);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <div className="flex flex-col gap-2">
            {coords ? (
                <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
                    <MapPin className="h-4 w-4" />
                    <div className="flex flex-col">
                        <span className="font-semibold">Location Verified</span>
                        <span className="text-xs opacity-75">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</span>
                    </div>
                    <Check className="h-4 w-4 ml-auto" />
                </div>
            ) : (
                <Button type="button" variant="outline" onClick={getLocation} isLoading={status === 'loading'} className="w-full justify-start h-auto py-3">
                    <MapPin className="mr-2 h-4 w-4" />
                    {label}
                </Button>
            )}
            {status === 'error' && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Permission denied or unavailable.</span>
                </div>
            )}
        </div>
    )
}
