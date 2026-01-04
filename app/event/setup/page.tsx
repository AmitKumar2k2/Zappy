'use client';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { updatePreSetup, updatePostSetup, completePreSetup, completePostSetup } from '@/store/slices/setupSlice';
import { advanceStep } from '@/store/slices/eventSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PhotoUploader } from '@/components/features/PhotoUploader';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SetupPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { preSetup, postSetup } = useAppSelector(state => state.setup);
    const { currentStep } = useAppSelector(state => state.event);

    // Guard: step 2
    useEffect(() => {
        if (currentStep !== 2) {
            router.replace('/dashboard');
        }
    }, [currentStep, router]);

    const handlePreSubmit = () => {
        if (!preSetup.photo) {
            dispatch(addToast({ type: 'error', message: 'Pre-Setup photo required' }));
            return;
        }
        dispatch(completePreSetup());
        dispatch(addToast({ type: 'success', message: 'Pre-Setup Saved' }));
    };

    const handlePostSubmit = () => {
        if (!postSetup.photo) {
            dispatch(addToast({ type: 'error', message: 'Post-Setup photo required' }));
            return;
        }
        dispatch(completePostSetup());
        dispatch(addToast({ type: 'success', message: 'Setup Completed!' }));
        setTimeout(() => {
            dispatch(advanceStep());
            router.push('/dashboard');
        }, 1000);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <h1 className="text-xl font-bold">Event Setup</h1>
            </div>

            {/* PRE SETUP */}
            <Card className={`transition-all ${preSetup.completed ? 'border-green-500 bg-green-50/10 opacity-70' : 'border-l-4 border-l-blue-500 shadow-md'}`}>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">1. Pre-Setup</CardTitle>
                        {preSetup.completed && <Check className="h-6 w-6 text-green-500" />}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!preSetup.completed ? (
                        <>
                            <PhotoUploader
                                label="Before Photo"
                                required
                                currentImage={preSetup.photo}
                                onFileSelect={(f, b64) => dispatch(updatePreSetup({ photo: b64 }))}
                            />
                            <div>
                                <label className="text-sm font-medium mb-1 block">Notes (Optional)</label>
                                <Input
                                    value={preSetup.notes}
                                    onChange={(e) => dispatch(updatePreSetup({ notes: e.target.value }))}
                                    placeholder="Any damage or issues found?"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-sm text-gray-600">
                            Pre-setup inputs locked. <span className="font-semibold text-green-700">Completed.</span>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    {!preSetup.completed && (
                        <Button className="w-full" onClick={handlePreSubmit}>
                            Save Pre-Setup <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* POST SETUP */}
            <Card className={`transition-all ${!preSetup.completed ? 'opacity-50 grayscale pointer-events-none' : 'shadow-md border-l-4 border-l-purple-500'}`}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">2. Post-Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <PhotoUploader
                        label="After Photo"
                        required
                        currentImage={postSetup.photo}
                        onFileSelect={(f, b64) => dispatch(updatePostSetup({ photo: b64 }))}
                    />
                    <div>
                        <label className="text-sm font-medium mb-1 block">Final Notes</label>
                        <Input
                            value={postSetup.notes}
                            onChange={(e) => dispatch(updatePostSetup({ notes: e.target.value }))}
                            placeholder="Setup completed successfully..."
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handlePostSubmit}
                        disabled={!preSetup.completed}
                        size="lg"
                    >
                        Finish Setup
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
