import React, { useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../../../components/dashboard/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  User,
  CheckCircle,
  XCircle,
  UserCheck,
  AlertCircle,
  ShieldCheck,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useCustomerManagement } from "./_lib";

export default function CustomerManagement() {
  const {
    users,
    loading,
    error,
    selectedUser,
    isDetailsDialogOpen,
    openDetailsDialog,
    closeDetailsDialog,
    handleApproveUser,
    handleBlockUser,
    handleUnblockUser,
  } = useCustomerManagement();

  const getStatusBadge = (user) => {
    console.log(user);
    if (user?.is_active && user?.last_login){
        return <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>;
    } else if(!user?.is_active && !user?.last_login) {
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
    } else if (!user?.is_active){
        return <Badge variant="outline" className="bg-red-50 text-red-700">Blocked</Badge>;
    } else {
      return <Badge variant="outline">user</Badge>;
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter size={14} /> Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                            <AvatarFallback>{user?.first_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                      <TableCell>{user.date_joined}</TableCell>
                      <TableCell>
                        {user?.last_login ? (
                            user.last_login
                          ) : (
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                              new-user
                            </span>
                          )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openDetailsDialog(user)}>
                              <User size={14} className="mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!user.is_active && !user.last_login && (
                              <DropdownMenuItem onClick={() => handleApproveUser(user.id, user.username)}>
                                <UserCheck size={14} className="mr-2 text-green-500" /> Approve User
                              </DropdownMenuItem>
                            )}
                            {user.is_active && (
                              <DropdownMenuItem onClick={() => handleBlockUser(user.id)}>
                                <XCircle size={14} className="mr-2 text-red-500" /> Block User
                              </DropdownMenuItem>
                            )}
                            {user.last_login && !user.is_active && (
                              <DropdownMenuItem onClick={() => handleUnblockUser(user.id)}>
                                <CheckCircle size={14} className="mr-2 text-green-500" /> Unblock User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDetailsDialogOpen} onOpenChange={closeDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Complete information about {selectedUser.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedUser.status)}
                      {selectedUser.role === "admin" && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">Admin</Badge>
                      )}
                    </div>
                  </div>
                </div>

            
                {/* <div className="grid grid-cols-2 gap-4 border rounded-md p-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                    <p>{selectedUser.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Registered</h4>
                    <p>{selectedUser.registeredDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Total Orders</h4>
                    <p>{selectedUser.ordersCount}</p>
                  </div>
                </div> */}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDetailsDialog}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}