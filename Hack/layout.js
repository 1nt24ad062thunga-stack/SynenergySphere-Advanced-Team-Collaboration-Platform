
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  LogOut,
  Zap,
  Bell,
  Menu,
  Moon,
  Sun
} from "lucide-react";
import ThemeProvider, { useTheme } from './components/ThemeProvider';
import OfflineProvider from './components/OfflineProvider';
import OfflineIndicator from './components/OfflineIndicator';

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: createPageUrl("Projects"),
    icon: FolderKanban,
  },
  {
    title: "Team",
    url: createPageUrl("Team"),
    icon: Users,
  },
];

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("User not authenticated, redirecting to login.");
      await User.login();
    }
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <style>
          {`
            :root {
              --primary-50: #eff6ff;
              --primary-100: #dbeafe;
              --primary-500: #3b82f6;
              --primary-600: #2563eb;
              --primary-700: #1d4ed8;
              --success-50: #ecfdf5;
              --success-500: #10b981;
              --warning-50: #fffbeb;
              --warning-500: #f59e0b;
              --error-50: #fef2f2;
              --error-500: #ef4444;
            }
            .dark {
              --primary-50: #1e293b;
              --primary-100: #334155;
              --primary-500: #3b82f6;
              --primary-600: #2563eb;
              --primary-700: #1d4ed8;
              --success-50: #064e3b;
              --success-500: #10b981;
              --warning-50: #451a03;
              --warning-500: #f59e0b;
              --error-50: #450a0a;
              --error-500: #ef4444;
            }
          `}
        </style>

        <Sidebar className="border-r border-white/20 dark:border-gray-700/50 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <SidebarHeader className="border-b border-gray-100/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">SynergySphere</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Team Collaboration</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`group hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                      <Bell className="w-4 h-4" />
                      <span>Notifications</span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Stay updated on project activities</p>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-100/50 dark:border-gray-700/50 p-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-sm">
                          {user.full_name?.charAt(0) || user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                          {user.full_name || user.email}
                        </p>
                        <div className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Profile")} className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Profile & Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">SynergySphere</h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>

        <OfflineIndicator />
      </div>
    </SidebarProvider>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <ThemeProvider>
      <OfflineProvider>
        <LayoutContent children={children} currentPageName={currentPageName} />
      </OfflineProvider>
    </ThemeProvider>
  );
}

 