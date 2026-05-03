import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, FileQuestion, Lock, ServerCrash, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
    status: number;
}

export default function Error({ status }: ErrorProps) {
    const title = {
        404: 'Page Not Found',
        403: 'Access Forbidden',
        500: 'Server Error',
        503: 'Service Unavailable',
    }[status] || 'An Error Occurred';

    const description = {
        404: "The page you're looking for doesn't exist or has been moved.",
        403: "You don't have permission to access this resource.",
        500: "Something went wrong on our end. We're working on it.",
        503: "We're briefly down for maintenance. Please check back soon.",
    }[status] || 'Something unexpected happened.';

    const Icon = {
        404: FileQuestion,
        403: Lock,
        500: ServerCrash,
        503: ShieldAlert,
    }[status] || AlertCircle;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
            <Head title={title} />
            
            <div className="relative mb-8">
                <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl"></div>
                <Icon className="relative h-24 w-24 text-primary" strokeWidth={1.5} />
            </div>

            <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-6xl">
                {status}
            </h1>
            
            <h2 className="mb-4 text-2xl font-semibold text-foreground/80">
                {title}
            </h2>
            
            <p className="mb-10 max-w-md text-lg text-muted-foreground">
                {description}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="gap-2">
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>

            <div className="mt-16 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} HPIO Dashboard. All rights reserved.</p>
            </div>
        </div>
    );
}
