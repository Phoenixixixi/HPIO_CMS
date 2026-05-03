import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Grid3x3, Globe, Briefcase, Eye, Users, ChartPie } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Landing Page',
        url: '/landing-content',
        icon: Globe,
    },
    {
        title: 'Intern Tracking',
        url: '/track-interns',
        icon: Users,
    },
    {
        title: 'Stories',
        url: '/stories',
        icon: BookOpen,
    },
    {
        title: 'Structure',
        url: '/structure',
        icon: Grid3x3,
    },
    {
        title: 'Works',
        url: '/works',
        icon: Briefcase,
    },
    {
        title: 'Live Preview',
        url: '/preview',
        icon: Eye,
    },
];

const mainNavReport: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard-report',
        icon: ChartPie,
    },
]

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} itemsReport={mainNavReport} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
