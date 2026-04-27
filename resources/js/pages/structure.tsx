import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Edit, Trash2, User as UserIcon, MoreHorizontal, Check, X } from 'lucide-react';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type BreadcrumbItem } from '@/types';

interface UserProfile {
    id: number;
    user_id: number;
    nama: string;
    status: string;
    foto_profile: string | null;
    description_profile: string | null;
}

interface User {
    id: number;
    name: string;
    email: string;
    users_profile: UserProfile | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/structure',
    },
];

export default function Structure() {
    const { users } = usePage<{ users: User[] }>().props;
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        status: 'active',
        description_profile: '',
        foto_profile: null as File | null,
        team: 'internal',
        role: 'Manager',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        // Since we are uploading a file, we use post with _method: 'PUT' or just use post if backend handles it
        // Inertia doesn't support multipart/form-data with PUT easily, so we use post with _method spoofing
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('email', data.email);
        if (data.password) formData.append('password', data.password);
        formData.append('status', data.status);
        formData.append('description_profile', data.description_profile);
        formData.append('team', data.team);
        formData.append('role', data.role);
        if (data.foto_profile) formData.append('foto_profile', data.foto_profile);

        post(route('users.update', editingUser.id), {
            forceFormData: true,
            onSuccess: () => {
                setIsEditOpen(false);
                setEditingUser(null);
                reset();
            },
        });
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            status: user.users_profile?.status || 'active',
            description_profile: user.users_profile?.description_profile || '',
            foto_profile: null,
            team: user.users_profile?.team || 'internal',
            role: user.users_profile?.role || 'Manager',
        });
        setIsEditOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(route('users.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                        <p className="text-muted-foreground mt-1">Manage your application users and their profiles.</p>
                    </div>

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
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Create New User</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to add a new user to the system.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="John Doe" />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="john@example.com" />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="team">Team</Label>
                                            <select 
                                                id="team" 
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={data.team} 
                                                onChange={e => setData('team', e.target.value)}
                                            >
                                                <option value="internal">Internal HPIO</option>
                                                <option value="cnjo">Tim CNJO</option>
                                            </select>
                                            {errors.team && <p className="text-sm text-red-500">{errors.team}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="role">Role</Label>
                                            <select 
                                                id="role" 
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={data.role} 
                                                onChange={e => setData('role', e.target.value)}
                                            >
                                                <option value="Manager">Manager</option>
                                                <option value="Team Leader">Team Leader</option>
                                                <option value="Ranger">Ranger</option>
                                                <option value="CNJO">CNJO</option>
                                                <option value="PROJECT MANAGER CNJO">PROJECT MANAGER CNJO</option>
                                            </select>
                                            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="foto_profile">Profile Photo</Label>
                                        <Input id="foto_profile" type="file" onChange={e => setData('foto_profile', e.target.files ? e.target.files[0] : null)} />
                                        {errors.foto_profile && <p className="text-sm text-red-500">{errors.foto_profile}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            value={data.description_profile}
                                            onChange={e => setData('description_profile', e.target.value)}
                                        />
                                        {errors.description_profile && <p className="text-sm text-red-500">{errors.description_profile}</p>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>Save User</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr className="text-left font-medium">
                                    <th className="p-4 w-[80px]">User</th>
                                    <th className="p-4">Name & Email</th>
                                    <th className="p-4">Team & Role</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 hidden md:table-cell">Bio</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.length > 0 ? users.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="p-4">
                                            <Avatar>
                                                <AvatarImage src={user.users_profile?.foto_profile ? `/storage/${user.users_profile.foto_profile}` : undefined} />
                                                <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                                            </Avatar>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-foreground">{user.name}</div>
                                            <div className="text-muted-foreground text-xs">{user.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline" className="mb-1 block w-fit capitalize">{user.users_profile?.team || 'internal'}</Badge>
                                            <span className="text-xs text-muted-foreground capitalize">{user.users_profile?.role || '-'}</span>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant={
                                                user.users_profile?.status === 'active' ? 'default' :
                                                    user.users_profile?.status === 'pending' ? 'outline' : 'destructive'
                                            }>
                                                {user.users_profile?.status || 'unknown'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 hidden md:table-cell max-w-[200px] truncate text-muted-foreground">
                                            {user.users_profile?.description_profile || '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => openEditModal(user)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No users found. Create one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) {
                    setEditingUser(null);
                    reset();
                    clearErrors();
                }
            }}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                                Update the user details and profile information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input id="edit-name" value={data.name} onChange={e => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input id="edit-email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-password">Password (Leave blank to keep current)</Label>
                                <Input id="edit-password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>
                            <div className="grid gap-2">
                                        <Label htmlFor="edit-status">Status</Label>
                                        <select
                                            id="edit-status"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-team">Team</Label>
                                            <select 
                                                id="edit-team" 
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={data.team} 
                                                onChange={e => setData('team', e.target.value)}
                                            >
                                                <option value="internal">Internal HPIO</option>
                                                <option value="cnjo">Tim CNJO</option>
                                            </select>
                                            {errors.team && <p className="text-sm text-red-500">{errors.team}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-role">Role</Label>
                                            <select 
                                                id="edit-role" 
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={data.role} 
                                                onChange={e => setData('role', e.target.value)}
                                            >
                                                <option value="Manager">Manager</option>
                                                <option value="Team Leader">Team Leader</option>
                                                <option value="Ranger">Ranger</option>
                                                <option value="CNJO">CNJO</option>
                                                <option value="PROJECT MANAGER CNJO">PROJECT MANAGER CNJO</option>
                                            </select>
                                            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-foto_profile">Profile Photo</Label>
                                        <Input id="edit-foto_profile" type="file" onChange={e => setData('foto_profile', e.target.files ? e.target.files[0] : null)} />
                                        {errors.foto_profile && <p className="text-sm text-red-500">{errors.foto_profile}</p>}
                                    </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <textarea
                                    id="edit-description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.description_profile}
                                    onChange={e => setData('description_profile', e.target.value)}
                                />
                                {errors.description_profile && <p className="text-sm text-red-500">{errors.description_profile}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>Update User</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
