import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, Users, Calendar, GraduationCap, Building2, Briefcase, User, X, ImageIcon, Search } from 'lucide-react';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Separator } from '@/components/ui/separator';

interface Member {
    id?: number;
    name: string;
    nim: string;
    major: string;
    university: string;
    work_place: string;
    job_desk: string;
    image: string | File | null;
}

interface InternBatch {
    id: number;
    Batch: string;
    start_date: string;
    end_date: string;
    achievement_title: string;
    achievement_description: string;
    members: Member[];
}

interface Props {
    interns: InternBatch[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Intern Tracking',
        href: '/track-interns',
    },
];

export default function InternTracking({ interns }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingIntern, setEditingIntern] = useState<InternBatch | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        Batch: '',
        start_date: '',
        end_date: '',
        achievement_title: '',
        achievement_description: '',
        members: [] as any[],
    });

    const openCreateModal = () => {
        setEditingIntern(null);
        reset();
        setData({
            Batch: '',
            start_date: '',
            end_date: '',
            achievement_title: '',
            achievement_description: '',
            members: [{ name: '', nim: '', major: '', university: '', work_place: '', job_desk: '', image: null }],
        });
        setIsDialogOpen(true);
    };

    const openEditModal = (intern: InternBatch) => {
        setEditingIntern(intern);
        setData({
            Batch: intern.Batch,
            start_date: intern.start_date,
            end_date: intern.end_date,
            achievement_title: intern.achievement_title,
            achievement_description: intern.achievement_description,
            members: intern.members.map(m => ({ ...m })),
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingIntern) {
            // Laravel handles multipart/form-data best with POST + _method: PUT
            post(route('track-interns.update', editingIntern.id), {
                forceFormData: true,
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post(route('track-interns.store'), {
                forceFormData: true,
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this intern batch? All members will also be deleted.')) {
            destroy(route('track-interns.destroy', id));
        }
    };

    const addMember = () => {
        setData('members', [...data.members, { name: '', nim: '', major: '', university: '', work_place: '', job_desk: '', image: null }]);
    };

    const removeMember = (index: number) => {
        const newMembers = [...data.members];
        newMembers.splice(index, 1);
        setData('members', newMembers);
    };

    const updateMember = (index: number, field: string, value: any) => {
        const newMembers = [...data.members];
        newMembers[index] = { ...newMembers[index], [field]: value };
        setData('members', newMembers);
    };

    const filteredInterns = interns.filter(intern => 
        intern.Batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intern.achievement_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Intern Tracking" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Intern Tracking</h1>
                        <p className="text-muted-foreground mt-1">Manage internship batches, achievements, and member details.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search batches..."
                                className="pl-9 w-[200px] md:w-[300px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={openCreateModal} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Batch
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {filteredInterns.length > 0 ? (
                        filteredInterns.map((intern) => (
                            <Card key={intern.id} className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                                    Batch {intern.Batch}
                                                </Badge>
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {intern.start_date} - {intern.end_date}
                                                </div>
                                            </div>
                                            <CardTitle className="text-2xl mt-2">{intern.achievement_title}</CardTitle>
                                            <CardDescription className="max-w-2xl">{intern.achievement_description}</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon" onClick={() => openEditModal(intern)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(intern.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="p-6">
                                        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            Team Members ({intern.members.length})
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {intern.members.map((member, idx) => (
                                                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-muted shrink-0 bg-muted flex items-center justify-center">
                                                        {member.image ? (
                                                            <img src={`/storage/${member.image}`} alt={member.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <User className="h-8 w-8 text-muted-foreground/50" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold truncate">{member.name}</p>
                                                        <p className="text-xs text-muted-foreground mb-2">{member.nim}</p>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center text-xs text-muted-foreground">
                                                                <GraduationCap className="mr-1.5 h-3 w-3 shrink-0" />
                                                                <span className="truncate">{member.major}, {member.university}</span>
                                                            </div>
                                                            <div className="flex items-center text-xs text-muted-foreground">
                                                                <Building2 className="mr-1.5 h-3 w-3 shrink-0" />
                                                                <span className="truncate">{member.work_place}</span>
                                                            </div>
                                                            <div className="flex items-center text-xs text-muted-foreground">
                                                                <Briefcase className="mr-1.5 h-3 w-3 shrink-0" />
                                                                <span className="truncate">{member.job_desk}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
                            <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-medium text-muted-foreground">No intern batches found</h3>
                            <p className="text-muted-foreground text-sm">Click "Add Batch" to start tracking your interns.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                    reset();
                    clearErrors();
                    setEditingIntern(null);
                }
            }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle>{editingIntern ? 'Edit Intern Batch' : 'Add New Intern Batch'}</DialogTitle>
                            <DialogDescription>
                                Fill in the batch details and add member information.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="Batch">Batch Name / Number</Label>
                                <Input id="Batch" value={data.Batch} onChange={e => setData('Batch', e.target.value)} placeholder="e.g. 5" />
                                {errors.Batch && <p className="text-xs text-destructive">{errors.Batch}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input id="start_date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} placeholder="e.g. Feb 2024" />
                                {errors.start_date && <p className="text-xs text-destructive">{errors.start_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input id="end_date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} placeholder="e.g. Jun 2024" />
                                {errors.end_date && <p className="text-xs text-destructive">{errors.end_date}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="achievement_title">Achievement Title</Label>
                                <Input id="achievement_title" value={data.achievement_title} onChange={e => setData('achievement_title', e.target.value)} placeholder="e.g. Best IT Support Team" />
                                {errors.achievement_title && <p className="text-xs text-destructive">{errors.achievement_title}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="achievement_description">Achievement Description</Label>
                                <textarea
                                    id="achievement_description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.achievement_description}
                                    onChange={e => setData('achievement_description', e.target.value)}
                                    placeholder="Briefly describe what this batch achieved..."
                                />
                                {errors.achievement_description && <p className="text-xs text-destructive">{errors.achievement_description}</p>}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold">Team Members</h3>
                                <Button type="button" variant="outline" size="sm" onClick={addMember} className="gap-1">
                                    <Plus className="h-4 w-4" />
                                    Add Member
                                </Button>
                            </div>

                            {data.members.map((member, index) => (
                                <Card key={index} className="relative pt-6">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="absolute top-2 right-2 h-7 w-7 text-destructive hover:bg-destructive/10" 
                                        onClick={() => removeMember(index)}
                                        disabled={data.members.length === 1}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label>Full Name</Label>
                                                <Input value={member.name} onChange={e => updateMember(index, 'name', e.target.value)} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>NIM / Student ID</Label>
                                                <Input value={member.nim} onChange={e => updateMember(index, 'nim', e.target.value)} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Major</Label>
                                                <Input value={member.major} onChange={e => updateMember(index, 'major', e.target.value)} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>University</Label>
                                                <Input value={member.university} onChange={e => updateMember(index, 'university', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label>Work Place (Assigned)</Label>
                                                <Input value={member.work_place} onChange={e => updateMember(index, 'work_place', e.target.value)} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Job Desk</Label>
                                                <Input value={member.job_desk} onChange={e => updateMember(index, 'job_desk', e.target.value)} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Profile Picture</Label>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden border shrink-0">
                                                        {member.image instanceof File ? (
                                                            <img src={URL.createObjectURL(member.image)} className="h-full w-full object-cover" />
                                                        ) : (typeof member.image === 'string' ? (
                                                            <img src={`/storage/${member.image}`} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                        ))}
                                                    </div>
                                                    <Input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="text-xs" 
                                                        onChange={e => updateMember(index, 'image', e.target.files?.[0] || null)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {errors.members && <p className="text-sm text-destructive">{errors.members}</p>}
                        </div>

                        <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>{editingIntern ? 'Update Batch' : 'Create Batch'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
