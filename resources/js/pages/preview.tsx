import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Monitor, Smartphone, RefreshCw, ExternalLink } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Live Preview',
        href: '/preview',
    },
];

export default function Preview() {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [iframeKey, setIframeKey] = useState(0);

    const refreshPreview = () => {
        setIframeKey(prev => prev + 1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Live Preview" />

            <div className="flex flex-col h-[calc(100vh-65px)] overflow-hidden">
                {/* Preview Toolbar */}
                <div className="flex items-center justify-between p-4 border-b bg-card shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-muted rounded-lg p-1">
                            <Button 
                                variant={viewMode === 'desktop' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                className="h-8 gap-2"
                                onClick={() => setViewMode('desktop')}
                            >
                                <Monitor className="h-4 w-4" />
                                <span className="hidden sm:inline">Desktop</span>
                            </Button>
                            <Button 
                                variant={viewMode === 'mobile' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                className="h-8 gap-2"
                                onClick={() => setViewMode('mobile')}
                            >
                                <Smartphone className="h-4 w-4" />
                                <span className="hidden sm:inline">Mobile</span>
                            </Button>
                        </div>
                        <Button variant="outline" size="sm" onClick={refreshPreview} className="h-8 gap-2">
                            <RefreshCw className="h-3 w-3" />
                            Refresh
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground mr-2 hidden md:block">
                            Viewing: <code className="bg-muted px-1 rounded">http://localhost:3000</code>
                        </p>
                        <Button variant="ghost" size="sm" asChild className="h-8 gap-2">
                            <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                Open New Tab
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Iframe Container */}
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-4 overflow-auto flex justify-center">
                    <div 
                        className={`transition-all duration-500 ease-in-out h-full shadow-2xl border bg-white overflow-hidden rounded-xl ${
                            viewMode === 'desktop' ? 'w-full' : 'w-[375px]'
                        }`}
                    >
                        <iframe 
                            key={iframeKey}
                            src="http://localhost:3000" 
                            className="w-full h-full border-none"
                            title="Landing Page Preview"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
