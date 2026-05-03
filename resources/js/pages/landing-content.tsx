import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save, Upload, Info, Eye, Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Type, LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

interface Props {
    contents: Record<string, any>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Landing Page Content',
        href: '/landing-content',
    },
];

export default function LandingContentPage({ contents }: Props) {
    const [activeTab, setActiveTab] = useState('hero');

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        contents: {
            hero_title: contents.hero_title || 'IT Operations & Maintenance HPIO KCIC',
            hero_subtitle: contents.hero_subtitle || 'Memastikan keandalan sistem dan infrastruktur IT stasiun Kereta Cepat Jakarta-Bandung demi kelancaran operasional setiap hari.',
            hero_cta_primary: contents.hero_cta_primary || 'Masuk ke Sistem',
            hero_cta_secondary: contents.hero_cta_secondary || 'Pelajari Lebih Lanjut',

            about_title: contents.about_title || 'About Us',
            about_description: contents.about_description || 'HPIO (High Performance Information Operations) is dedicated to maintaining the excellence of IT systems for the Jakarta-Bandung High-Speed Railway.',
            about_image: contents.about_image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop',
            about_items: Array.isArray(contents.about_items)
                ? contents.about_items
                : (typeof contents.about_items === 'string' ? JSON.parse(contents.about_items) : [
                    { heading: 'Our Mission', description: 'HPIO serves as the critical nervous system of PT KCIC...' },
                    { heading: 'Our Vision', description: 'Our operational mandate focuses on proactive monitoring...' }
                ]),

            terminal_uptime: contents.terminal_uptime || 'NOMINAL',
            terminal_latency: contents.terminal_latency || '1.2ms',

            services_title: contents.services_title || 'Core Responsibilities',
            services_subtitle: contents.services_subtitle || 'Kami berdedikasi untuk menjaga perfoma sistem IT agar operasional perjalanan Kereta Cepat selalu dalam kondisi prima.',
            services_items: Array.isArray(contents.services_items)
                ? contents.services_items
                : (typeof contents.services_items === 'string' ? JSON.parse(contents.services_items) : [
                    { logo: 'Shield', heading: 'System Security', desc: 'Protection and monitoring of critical IT infrastructure.' },
                    { logo: 'Zap', heading: 'High Performance', desc: 'Optimizing network latency and terminal responsiveness.' }
                ]),

            works_title: contents.works_title || 'Hasil Pekerjaan & Kegiatan',
            works_subtitle: contents.works_subtitle || 'Dokumentasi nyata kegiatan kami berserta deskripsi dari portofolio operasional di lapangan.',
            works_items: Array.isArray(contents.works_items)
                ? contents.works_items
                : (typeof contents.works_items === 'string' ? JSON.parse(contents.works_items) : [
                    {
                        title: "Pemeliharaan TVM & Gate Stasiun",
                        description: "Tim HPIO melakukan pemeliharaan berkala pada perangkat layar sentuh...",
                        images: ["https://images.unsplash.com/photo-1591035882672-0050e0f316bf?q=80&w=1000&auto=format&fit=crop"]
                    }
                ]),
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('landing.content.update'));
    };

    const updateContent = (key: string, value: any) => {
        setData('contents', {
            ...data.contents,
            [key]: value,
        });
    };

    const handleImageUpload = async (key: string, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', key);

        try {
            const response = await fetch(route('landing.content.upload'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
            const result = await response.json();
            if (result.url) {
                updateContent(key, result.url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Landing Content" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Landing Page Content</h1>
                        <p className="text-muted-foreground mt-1">Update the text and images on your landing page.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild className="gap-2">
                            <Link href="/preview">
                                <Eye className="h-4 w-4" />
                                View Preview
                            </Link>
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing} className="gap-2">
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {recentlySuccessful && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-lg flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Changes saved successfully!
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Tabs Sidebar */}
                    <div className="w-full md:w-64 flex flex-col gap-1">
                        <TabButton id="hero" label="Hero Section" active={activeTab} onClick={setActiveTab} />
                        <TabButton id="about" label="About Section" active={activeTab} onClick={setActiveTab} />
                        <TabButton id="services" label="Services" active={activeTab} onClick={setActiveTab} />

                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {activeTab === 'hero' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Hero Section</CardTitle>
                                        <CardDescription>Main headline and introductory text.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="hero_title">Headline</Label>
                                            <textarea
                                                id="hero_title"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={data.contents.hero_title}
                                                onChange={(e) => updateContent('hero_title', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="hero_subtitle">Subtitle</Label>
                                            <textarea
                                                id="hero_subtitle"
                                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={data.contents.hero_subtitle}
                                                onChange={(e) => updateContent('hero_subtitle', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="hero_cta_primary">Primary Button</Label>
                                                <Input
                                                    id="hero_cta_primary"
                                                    value={data.contents.hero_cta_primary}
                                                    onChange={(e) => updateContent('hero_cta_primary', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="hero_cta_secondary">Secondary Button</Label>
                                                <Input
                                                    id="hero_cta_secondary"
                                                    value={data.contents.hero_cta_secondary}
                                                    onChange={(e) => updateContent('hero_cta_secondary', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'about' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About Section</CardTitle>
                                        <CardDescription>Manage your company story and main image.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="about_title">Title</Label>
                                            <Input
                                                id="about_title"
                                                value={data.contents.about_title}
                                                onChange={(e) => updateContent('about_title', e.target.value)}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="about_description">Description</Label>
                                            <textarea
                                                id="about_description"
                                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={data.contents.about_description}
                                                onChange={(e) => updateContent('about_description', e.target.value)}
                                            />
                                        </div>

                                        <div className="grid gap-4">
                                            <Label>Main Image</Label>
                                            <div className="flex items-start gap-4">
                                                <div className="relative aspect-video w-48 overflow-hidden rounded-lg border bg-muted">
                                                    {data.contents.about_image ? (
                                                        <img src={data.contents.about_image} alt="About" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <Input
                                                        placeholder="Image URL"
                                                        value={data.contents.about_image}
                                                        onChange={(e) => updateContent('about_image', e.target.value)}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => document.getElementById('about_image_upload')?.click()}
                                                        >
                                                            <Upload className="mr-2 h-4 w-4" />
                                                            Upload File
                                                        </Button>
                                                        <input
                                                            id="about_image_upload"
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => e.target.files?.[0] && handleImageUpload('about_image', e.target.files[0])}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium">About Items (Points)</h4>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newItems = [...data.contents.about_items, { heading: '', description: '' }];
                                                        updateContent('about_items', newItems);
                                                    }}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Item
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                {data.contents.about_items.map((item: any, index: number) => (
                                                    <div key={index} className="relative rounded-lg border p-4 space-y-3 bg-muted/30">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item {index + 1}</span>
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7"
                                                                    disabled={index === 0}
                                                                    onClick={() => {
                                                                        const newItems = [...data.contents.about_items];
                                                                        [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
                                                                        updateContent('about_items', newItems);
                                                                    }}
                                                                >
                                                                    <ChevronUp className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7"
                                                                    disabled={index === data.contents.about_items.length - 1}
                                                                    onClick={() => {
                                                                        const newItems = [...data.contents.about_items];
                                                                        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
                                                                        updateContent('about_items', newItems);
                                                                    }}
                                                                >
                                                                    <ChevronDown className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                                    onClick={() => {
                                                                        const newItems = data.contents.about_items.filter((_: any, i: number) => i !== index);
                                                                        updateContent('about_items', newItems);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Input
                                                                placeholder="Heading"
                                                                value={item.heading}
                                                                onChange={(e) => {
                                                                    const newItems = [...data.contents.about_items];
                                                                    newItems[index].heading = e.target.value;
                                                                    updateContent('about_items', newItems);
                                                                }}
                                                            />
                                                            <textarea
                                                                placeholder="Description"
                                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                                value={item.description}
                                                                onChange={(e) => {
                                                                    const newItems = [...data.contents.about_items];
                                                                    newItems[index].description = e.target.value;
                                                                    updateContent('about_items', newItems);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <h4 className="text-sm font-medium mb-4">Terminal Overlay Settings</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="terminal_uptime">Uptime Status</Label>
                                                    <Input
                                                        id="terminal_uptime"
                                                        value={data.contents.terminal_uptime}
                                                        onChange={(e) => updateContent('terminal_uptime', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="terminal_latency">Network Latency</Label>
                                                    <Input
                                                        id="terminal_latency"
                                                        value={data.contents.terminal_latency}
                                                        onChange={(e) => updateContent('terminal_latency', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'services' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Core Responsibilities</CardTitle>
                                        <CardDescription>Manage the main features or services highlighted on the landing page.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="services_title">Section Title</Label>
                                            <Input
                                                id="services_title"
                                                value={data.contents.services_title}
                                                onChange={(e) => updateContent('services_title', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="services_subtitle">Section Subtitle</Label>
                                            <textarea
                                                id="services_subtitle"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={data.contents.services_subtitle}
                                                onChange={(e) => updateContent('services_subtitle', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4 border-t">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium">Responsibility Items</h4>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newItems = [...data.contents.services_items, { logo: 'Activity', heading: '', desc: '' }];
                                                        updateContent('services_items', newItems);
                                                    }}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Item
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {data.contents.services_items.map((item: any, index: number) => (
                                                    <div key={index} className="relative rounded-lg border p-4 space-y-3 bg-muted/30">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2 flex-1">
                                                                <div className="p-2 rounded bg-background border">
                                                                    {(() => {
                                                                        const Icon = (LucideIcons as any)[item.logo] || LucideIcons.Activity;
                                                                        return <Icon className="h-4 w-4" />;
                                                                    })()}
                                                                </div>
                                                                <Input
                                                                    placeholder="Icon Name (Lucide)"
                                                                    className="h-8 text-xs font-mono"
                                                                    value={item.logo}
                                                                    onChange={(e) => {
                                                                        const newItems = [...data.contents.services_items];
                                                                        newItems[index].logo = e.target.value;
                                                                        updateContent('services_items', newItems);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                                    onClick={() => {
                                                                        const newItems = data.contents.services_items.filter((_: any, i: number) => i !== index);
                                                                        updateContent('services_items', newItems);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Input
                                                                placeholder="Heading"
                                                                value={item.heading}
                                                                onChange={(e) => {
                                                                    const newItems = [...data.contents.services_items];
                                                                    newItems[index].heading = e.target.value;
                                                                    updateContent('services_items', newItems);
                                                                }}
                                                            />
                                                            <textarea
                                                                placeholder="Description"
                                                                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                                value={item.desc}
                                                                onChange={(e) => {
                                                                    const newItems = [...data.contents.services_items];
                                                                    newItems[index].desc = e.target.value;
                                                                    updateContent('services_items', newItems);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* {activeTab === 'works' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Works Section</CardTitle>
                                        <CardDescription>Portfolio and operational documentation.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="works_title">Section Title</Label>
                                            <Input
                                                id="works_title"
                                                value={data.contents.works_title}
                                                onChange={(e) => updateContent('works_title', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="works_subtitle">Section Subtitle</Label>
                                            <textarea
                                                id="works_subtitle"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={data.contents.works_subtitle}
                                                onChange={(e) => updateContent('works_subtitle', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4 border-t">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium">Work Portfolio Items</h4>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newItems = [...data.contents.works_items, { title: '', description: '', images: [''] }];
                                                        updateContent('works_items', newItems);
                                                    }}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Work
                                                </Button>
                                            </div>

                                            <div className="space-y-6">
                                                {data.contents.works_items.map((item: any, index: number) => (
                                                    <div key={index} className="relative rounded-lg border p-5 space-y-4 bg-muted/30">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-bold">Project #{index + 1}</span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                                onClick={() => {
                                                                    const newItems = data.contents.works_items.filter((_: any, i: number) => i !== index);
                                                                    updateContent('works_items', newItems);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="grid gap-4">
                                                            <div className="grid gap-2">
                                                                <Label>Project Title</Label>
                                                                <Input
                                                                    value={item.title}
                                                                    onChange={(e) => {
                                                                        const newItems = [...data.contents.works_items];
                                                                        newItems[index].title = e.target.value;
                                                                        updateContent('works_items', newItems);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label>Description</Label>
                                                                <textarea
                                                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                                    value={item.description}
                                                                    onChange={(e) => {
                                                                        const newItems = [...data.contents.works_items];
                                                                        newItems[index].description = e.target.value;
                                                                        updateContent('works_items', newItems);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label>Project Images</Label>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                    {(Array.isArray(item.images) ? item.images : []).map((imgUrl: string, imgIndex: number) => (
                                                                        <div key={imgIndex} className="relative aspect-square rounded-md border bg-muted overflow-hidden group">
                                                                            <img src={imgUrl} className="h-full w-full object-cover" />
                                                                            <button
                                                                                type="button"
                                                                                className="absolute top-1 right-1 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                onClick={() => {
                                                                                    const newItems = [...data.contents.works_items];
                                                                                    newItems[index].images = item.images.filter((_: any, i: number) => i !== imgIndex);
                                                                                    updateContent('works_items', newItems);
                                                                                }}
                                                                            >
                                                                                <Trash2 className="h-3 w-3" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    {(!item.images || item.images.length < 4) && (
                                                                        <div 
                                                                            className="flex aspect-square items-center justify-center rounded-md border border-dashed hover:bg-muted/50 transition-colors cursor-pointer"
                                                                            onClick={() => document.getElementById(`work-img-upload-${index}`)?.click()}
                                                                        >
                                                                            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                                                                <Upload className="h-5 w-5" />
                                                                                <span className="text-xs">Upload</span>
                                                                            </div>
                                                                            <input
                                                                                id={`work-img-upload-${index}`}
                                                                                type="file"
                                                                                className="hidden"
                                                                                accept="image/*"
                                                                                onChange={async (e) => {
                                                                                    const file = e.target.files?.[0];
                                                                                    if (file) {
                                                                                        const formData = new FormData();
                                                                                        formData.append('image', file);
                                                                                        formData.append('key', 'generic');
                                                                                        try {
                                                                                            const response = await fetch(route('landing.content.upload'), {
                                                                                                method: 'POST',
                                                                                                body: formData,
                                                                                                headers: {
                                                                                                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                                                                                                },
                                                                                            });
                                                                                            const result = await response.json();
                                                                                            if (result.url) {
                                                                                                const newItems = [...data.contents.works_items];
                                                                                                newItems[index].images = [...(Array.isArray(item.images) ? item.images : []), result.url];
                                                                                                updateContent('works_items', newItems);
                                                                                            }
                                                                                        } catch (error) {
                                                                                            console.error('Upload failed:', error);
                                                                                        }
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )} */}
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function TabButton({ id, label, active, onClick }: { id: string, label: string, active: string, onClick: (id: string) => void }) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`px-4 py-2 text-left text-sm font-medium rounded-md transition-colors ${active === id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
                }`}
        >
            {label}
        </button>
    );
}
