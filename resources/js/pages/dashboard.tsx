import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 rounded-xl border-2 border-dashed p-12 text-center bg-muted/20">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                        >
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome to HPIO Dashboard</h2>
                        <p className="text-muted-foreground mx-auto max-w-[600px] text-lg">
                            Manage and edit your landing page content, team structure, intern tracking, and success stories easily from this central panel.
                        </p>
                    </div>
                    <div className="mt-4 flex justify-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="h-2 w-2 rounded-full bg-primary/60" />
                        <div className="h-2 w-2 rounded-full bg-primary/30" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {[
                        { title: 'Landing Page', desc: 'Hero, About, & Services', icon: 'Globe' },
                        { title: 'Intern Tracking', desc: 'Batches & Members', icon: 'Users' },
                        { title: 'Stories', desc: 'Project Success Stories', icon: 'BookOpen' },
                        { title: 'Structure', desc: 'Manage User Profiles', icon: 'Grid3x3' }
                    ].map((item, i) => (
                        <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-bold">{item.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
