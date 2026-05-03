import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Edit, Trash2, BookOpen, Clock, MoreHorizontal, Image as ImageIcon, X, Eye, Save } from 'lucide-react';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem } from '@/types';

interface StoryImage {
    id: number;
    story_id: number;
    image_path: string;
}

interface Story {
    id: number;
    title: string;
    description: string;
    time: string;
    images: StoryImage[];
}

interface Props {
    stories: Story[];
    contents: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stories Management',
        href: '/stories',
    },
];

export default function Stories({ stories, contents }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingStory, setEditingStory] = useState<Story | null>(null);
    const [deletedImages, setDeletedImages] = useState<number[]>([]);

    // Form for global headline and description
    const contentForm = useForm({
        story_headline: contents.story_headline || 'Our Stories',
        story_description: contents.story_description || 'Real stories from our operations and projects.',
    });

    // Form for individual story items
    const { data, setData, post, transform, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        title: '',
        desc: '',
        time: '',
        images: [] as File[],
    });

    const handleUpdateContent = (e: React.FormEvent) => {
        e.preventDefault();
        contentForm.post(route('stories.updateContent'));
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('stories.store'), {
            forceFormData: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStory) return;

        transform((data) => ({
            ...data,
            _method: 'PUT',
            deleted_images: deletedImages,
        }));

        post(route('stories.update', editingStory.id), {
            forceFormData: true,
            onSuccess: () => {
                setIsEditOpen(false);
                setEditingStory(null);
                setDeletedImages([]);
                reset();
            },
        });
    };

    const openEditModal = (story: Story) => {
        setEditingStory(story);
        setData({
            title: story.title,
            desc: story.description,
            time: story.time,
            images: [],
        });
        setDeletedImages([]);
        setIsEditOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this story item?')) {
            destroy(route('stories.destroy', id));
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
            <Head title="Stories Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Success Stories</h1>
                        <p className="text-muted-foreground mt-1">Manage the narrative of your achievements and projects.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Global Settings */}
                    <Card className="lg:col-span-1 h-fit">
                        <CardHeader>
                            <CardTitle>Section Header</CardTitle>
                            <CardDescription>Update the main headline and description for the Stories section.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateContent} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="story_headline">Headline</Label>
                                    <Input 
                                        id="story_headline" 
                                        value={contentForm.data.story_headline} 
                                        onChange={e => contentForm.setData('story_headline', e.target.value)} 
                                    />
                                    {contentForm.errors.story_headline && <p className="text-xs text-destructive">{contentForm.errors.story_headline}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="story_description">Description</Label>
                                    <textarea
                                        id="story_description"
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={contentForm.data.story_description}
                                        onChange={e => contentForm.setData('story_description', e.target.value)}
                                    />
                                    {contentForm.errors.story_description && <p className="text-xs text-destructive">{contentForm.errors.story_description}</p>}
                                </div>
                                <Button type="submit" disabled={contentForm.processing} className="w-full gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Stories List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Story Items ({stories.length})</h2>
                            <Dialog open={isCreateOpen} onOpenChange={(open) => {
                                setIsCreateOpen(open);
                                if (!open) { reset(); clearErrors(); }
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Story Item
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                    <form onSubmit={handleCreate}>
                                        <DialogHeader>
                                            <DialogTitle>Add Story Item</DialogTitle>
                                            <DialogDescription>Create a new project story with details and up to 3 images.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="title">Project Title</Label>
                                                <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. System Integration" />
                                                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="time">Time / Duration</Label>
                                                <Input id="time" value={data.time} onChange={e => setData('time', e.target.value)} placeholder="e.g. Q1 2024 or 3 Months" />
                                                {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="desc">Description</Label>
                                                <textarea
                                                    id="desc"
                                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                    value={data.desc}
                                                    onChange={e => setData('desc', e.target.value)}
                                                    placeholder="Describe the story..."
                                                />
                                                {errors.desc && <p className="text-xs text-destructive">{errors.desc}</p>}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="images">Images (Max 3)</Label>
                                                <Input
                                                    id="images"
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={e => setData('images', e.target.files ? Array.from(e.target.files) : [])}
                                                />
                                                {errors.images && <p className="text-xs text-destructive">{errors.images}</p>}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={processing}>Create Story</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {stories.length > 0 ? stories.map((story) => (
                                <Card key={story.id} className="overflow-hidden flex flex-col md:flex-row">
                                    <div className="md:w-48 bg-muted aspect-video md:aspect-square relative overflow-hidden shrink-0">
                                        {story.images.length > 0 ? (
                                            <img src={`/storage/${story.images[0].image_path}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        {story.images.length > 1 && (
                                            <Badge className="absolute bottom-2 right-2 bg-black/60 text-white border-none">
                                                +{story.images.length - 1}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="p-6 flex-1 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold">{story.title}</h3>
                                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {story.time}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEditModal(story)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(story.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>
                                    </div>
                                </Card>
                            )) : (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                                    <h3 className="text-lg font-medium">No stories yet</h3>
                                    <p className="text-muted-foreground text-sm">Add your first project story to showcase your success.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) { setEditingStory(null); setDeletedImages([]); reset(); clearErrors(); }
            }}>
                <DialogContent className="sm:max-w-[700px]">
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Story Item</DialogTitle>
                            <DialogDescription>Update project details and manage images.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-title">Title</Label>
                                    <Input id="edit-title" value={data.title} onChange={e => setData('title', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-time">Time / Duration</Label>
                                    <Input id="edit-time" value={data.time} onChange={e => setData('time', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-desc">Description</Label>
                                <textarea
                                    id="edit-desc"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.desc}
                                    onChange={e => setData('desc', e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Current Images ({editingStory?.images.length || 0}/3)</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {editingStory?.images.map((img) => (
                                        <div key={img.id} className="relative aspect-video rounded-md overflow-hidden border group">
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
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-images">Add New Images (Remaining slots: {3 - (editingStory?.images.length || 0) + deletedImages.length})</Label>
                                <Input
                                    id="edit-images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => setData('images', e.target.files ? Array.from(e.target.files) : [])}
                                />
                                {errors.images && <p className="text-xs text-destructive">{errors.images}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>Update Story</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
