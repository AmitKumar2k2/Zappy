'use client';
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { Calendar, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { id, customerName, location, date, status, currentStep } = useAppSelector((state) => state.event);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const steps = [
        { label: 'Check-In', description: 'Arrive' },
        { label: 'OTP', description: 'Verify' },
        { label: 'Setup', description: 'Work' },
        { label: 'Close', description: 'Done' }
    ];

    const handleAction = () => {
        const routes = ['/event/check-in', '/event/start', '/event/setup', '/event/close'];
        if (currentStep < routes.length) {
            router.push(routes[currentStep]);
        }
    };

    const getActionButtonText = () => {
        switch (currentStep) {
            case 0: return "Start Check-In";
            case 1: return "Verify Customer OTP";
            case 2: return "Start Event Setup";
            case 3: return "Complete Event";
            default: return "View Summary";
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Today's Event</h2>
                <p className="text-gray-500 text-sm">Event ID: {id}</p>
            </div>

            <Card className="shadow-sm border-l-4 border-l-primary">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="flex justify-between items-center text-lg">
                        <span className="font-bold">{customerName}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {status.toUpperCase()}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center text-sm text-gray-700">
                            <MapPin className="mr-3 h-5 w-5 text-gray-400 shrink-0" />
                            <span className="font-medium">{location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                            <Calendar className="mr-3 h-5 w-5 text-gray-400 shrink-0" />
                            <span className="font-medium">{date}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="py-2">
                <Stepper steps={steps} currentStep={currentStep} />
            </div>

            <div className="pt-2">
                {status === 'completed' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-2 shadow-sm">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                        <h3 className="text-lg font-bold text-green-900">Event Completed!</h3>
                        <p className="text-sm text-green-700 p-2">Thank you for your service.</p>
                    </div>
                ) : (
                    <Button
                        onClick={handleAction}
                        className="w-full shadow-lg shadow-primary/20 h-14 text-lg"
                    >
                        {getActionButtonText()}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
