import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Edit, Trash2, Briefcase, MoreHorizontal, Image as ImageIcon, X, Eye } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';

interface WorkImage {
    id: number;
    work_id: number;
    image_path: string;
}

interface Work {
    id: number;
    title: string;
    description: string;
    images: WorkImage[];
}

interface Props {
    works: Work[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Works Management',
        href: '/works',
    },
];

export default function Works({ works }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingWork, setEditingWork] = useState<Work | null>(null);
    const [deletedImages, setDeletedImages] = useState<number[]>([]);

    const { data, setData, post, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        images: [] as File[],
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('works.store'), {
            forceFormData: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingWork) return;

        // Using POST with _method spoofing for multipart/form-data update
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', data.title);
        formData.append('description', data.description);

        data.images.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        deletedImages.forEach((id, index) => {
            formData.append(`deleted_images[${index}]`, id.toString());
        });

        post(route('works.update', editingWork.id), {
            forceFormData: true,
            onSuccess: () => {
                setIsEditOpen(false);
                setEditingWork(null);
                setDeletedImages([]);
                reset();
            },
        });
    };

    const openEditModal = (work: Work) => {
        setEditingWork(work);
        setData({
            title: work.title,
            description: work.description,
            images: [],
        });
        setDeletedImages([]);
        setIsEditOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this work?')) {
            destroy(route('works.destroy', id));
        }
    };

    const toggleDeleteImage = (id: number) => {
        if (deletedImages.includes(id)) {
            setDeletedImages(deletedImages.filter(i => i !== id));
        } else {
            setDeletedImages([...deletedImages, id]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Works Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Works Portfolio</h1>
                        <p className="text-muted-foreground mt-1">Manage your projects, accomplishments, and operational results.</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild className="gap-2">
                            <Link href="/preview">
                                <Eye className="h-4 w-4" />
                                View Preview
                            </Link>
                        </Button>
                        <Dialog open={isCreateOpen} onOpenChange={(open) => {
                            setIsCreateOpen(open);
                            if (!open) {
                                reset();
                                clearErrors();
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Work
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <form onSubmit={handleCreate}>
                                    <DialogHeader>
                                        <DialogTitle>Create New Work</DialogTitle>
                                        <DialogDescription>
                                            Add a new project or operational result with up to 4 images.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Rapid Troubleshooting" />
                                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Description</Label>
                                            <textarea
                                                id="description"
                                                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                placeholder="Detailed description of the work..."
                                            />
                                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="images">Images (Max 4)</Label>
                                            <Input
                                                id="images"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={e => setData('images', e.target.files ? Array.from(e.target.files) : [])}
                                            />
                                            <p className="text-xs text-muted-foreground">Select up to 4 images. Only the first 4 will be saved.</p>
                                            {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={processing}>Save Work</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {works.length > 0 ? works.map((work) => (
                            <div key={work.id} className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                                <div className="aspect-video relative bg-muted flex items-center justify-center overflow-hidden">
                                    {work.images.length > 0 ? (
                                        <img
                                            src={`/storage/${work.images[0].image_path}`}
                                            alt={work.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditModal(work)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(work.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    {work.images.length > 1 && (
                                        <Badge className="absolute bottom-2 right-2 bg-black/50 text-white border-none">
                                            +{work.images.length - 1} images
                                        </Badge>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-xl mb-2 line-clamp-1">{work.title}</h3>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                        {work.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <Button variant="outline" size="sm" className="w-full" onClick={() => openEditModal(work)}>
                                            <Edit className="mr-2 h-3 w-3" /> Edit Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <h3 className="text-lg font-medium">No works found</h3>
                                <p className="text-sm">Click "Add Work" to populate your portfolio.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) {
                    setEditingWork(null);
                    setDeletedImages([]);
                    reset();
                    clearErrors();
                }
            }}>
                <DialogContent className="sm:max-w-[700px]">
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Work</DialogTitle>
                            <DialogDescription>
                                Update the project details and manage images.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input id="edit-title" value={data.title} onChange={e => setData('title', e.target.value)} />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <textarea
                                    id="edit-description"
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="grid gap-4">
                                <Label>Current Images ({editingWork?.images.length || 0}/4)</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {editingWork?.images.map((img) => (
                                        <div key={img.id} className="relative aspect-square rounded-md overflow-hidden border group">
                                            <img
                                                src={`/storage/${img.image_path}`}
                                                className={`w-full h-full object-cover transition-opacity ${deletedImages.includes(img.id) ? 'opacity-30 grayscale' : ''}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleDeleteImage(img.id)}
                                                className="absolute top-1 right-1 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                {deletedImages.includes(img.id) ? <Plus className="h-3 w-3 rotate-45" /> : <X className="h-3 w-3" />}
                                            </button>
                                            {deletedImages.includes(img.id) && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <Badge variant="destructive">Removing</Badge>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {/* Placeholder if empty */}
                                    {editingWork?.images.length === 0 && (
                                        <div className="col-span-4 py-4 text-center border-2 border-dashed rounded-md text-muted-foreground text-xs">
                                            No images uploaded.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-images">Add New Images (Remaining slots: {4 - (editingWork?.images.length || 0) + deletedImages.length})</Label>
                                <Input
                                    id="edit-images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => setData('images', e.target.files ? Array.from(e.target.files) : [])}
                                />
                                {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>Update Work</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
