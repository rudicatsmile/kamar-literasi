"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UserCog,
  UserPlus,
  ShieldCheck,
  User,
  Search,
  KeyRound,
  Trash2,
  Edit3,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Upload,
  X,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AdminUser,
  createUserAction,
  updateUserAction,
  resetUserPasswordAction,
  deleteUserAction,
  uploadUserAvatarAction,
} from "@/app/actions/users";

function getInitials(name: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AdminPenggunaClientProps {
  initialUsers: AdminUser[];
  currentUserId: string | null;
}

export function AdminPenggunaClient({
  initialUsers,
  currentUserId,
}: AdminPenggunaClientProps) {
  const router = useRouter();
  const [users, setUsers] = React.useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<"all" | "admin" | "member">("all");

  // Dialog States
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Selected User for Edit/Reset/Delete
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null);

  // Form states - Create
  const [createForm, setCreateForm] = React.useState({
    fullName: "",
    email: "",
    password: "",
    whatsapp: "",
    role: "member" as "admin" | "member",
    avatarUrl: "",
  });
  const [showCreatePassword, setShowCreatePassword] = React.useState(false);

  // Form states - Edit
  const [editForm, setEditForm] = React.useState({
    fullName: "",
    whatsapp: "",
    role: "member" as "admin" | "member",
    avatarUrl: "",
  });

  // Form states - Reset Password
  const [newPassword, setNewPassword] = React.useState("");
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  // Loading states
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadingTarget, setUploadingTarget] = React.useState<"create" | "edit" | null>(null);

  // Handle avatar upload
  const handlePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "create" | "edit"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format foto harus JPG, JPEG, PNG, atau WEBP.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2 MB.");
      return;
    }

    setUploadingTarget(target);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadUserAvatarAction(formData);
      if (!res.success || !res.url) {
        toast.error(res.error || "Gagal mengunggah foto profil.");
        return;
      }

      if (target === "create") {
        setCreateForm((prev) => ({ ...prev, avatarUrl: res.url! }));
      } else {
        setEditForm((prev) => ({ ...prev, avatarUrl: res.url! }));
      }
      toast.success("Foto profil berhasil diunggah.");
    } catch {
      toast.error("Terjadi kesalahan sistem saat mengunggah foto.");
    } finally {
      setUploadingTarget(null);
    }
  };

  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Calculations
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const memberCount = users.filter((u) => u.role === "member").length;

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      u.fullName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.whatsapp && u.whatsapp.toLowerCase().includes(query));
    return matchesRole && matchesSearch;
  });

  // Handle Create User
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.fullName.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      toast.error("Nama lengkap, email, dan kata sandi wajib diisi.");
      return;
    }
    if (createForm.password.length < 8) {
      toast.error("Kata sandi minimal 8 karakter.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createUserAction({
        fullName: createForm.fullName.trim(),
        email: createForm.email.trim().toLowerCase(),
        password: createForm.password,
        whatsapp: createForm.whatsapp.trim() || undefined,
        role: createForm.role,
        avatarUrl: createForm.avatarUrl.trim() || undefined,
      });

      if (!res.success) {
        toast.error(res.error || "Gagal menambahkan pengguna.");
        return;
      }

      toast.success(`Pengguna ${createForm.fullName} (${createForm.role}) berhasil ditambahkan.`);
      setCreateDialogOpen(false);
      setCreateForm({
        fullName: "",
        email: "",
        password: "",
        whatsapp: "",
        role: "member",
        avatarUrl: "",
      });
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan sistem saat membuat pengguna.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Dialog
  const openEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName,
      whatsapp: user.whatsapp || "",
      role: user.role,
      avatarUrl: user.avatarUrl || "",
    });
    setEditDialogOpen(true);
  };

  // Handle Edit User
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!editForm.fullName.trim()) {
      toast.error("Nama lengkap wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateUserAction({
        id: selectedUser.id,
        fullName: editForm.fullName.trim(),
        whatsapp: editForm.whatsapp.trim() || undefined,
        role: editForm.role,
        avatarUrl: editForm.avatarUrl.trim() || null,
      });

      if (!res.success) {
        toast.error(res.error || "Gagal memperbarui pengguna.");
        return;
      }

      toast.success(`Profil pengguna ${editForm.fullName} berhasil diperbarui.`);
      setEditDialogOpen(false);
      setSelectedUser(null);
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan sistem saat memperbarui pengguna.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Reset Dialog
  const openReset = (user: AdminUser) => {
    setSelectedUser(user);
    setNewPassword("");
    setShowNewPassword(false);
    setResetDialogOpen(true);
  };

  // Handle Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (newPassword.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetUserPasswordAction(selectedUser.id, newPassword);

      if (!res.success) {
        toast.error(res.error || "Gagal memperbarui kata sandi.");
        return;
      }

      toast.success(`Kata sandi akun ${selectedUser.email} berhasil diubah.`);
      setResetDialogOpen(false);
      setSelectedUser(null);
      setNewPassword("");
    } catch {
      toast.error("Terjadi kesalahan sistem saat mengubah kata sandi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Confirmation
  const openDelete = (user: AdminUser) => {
    if (user.id === currentUserId) {
      toast.error("Anda tidak dapat menghapus akun Anda sendiri.");
      return;
    }
    if (user.role === "admin" && adminCount <= 1) {
      toast.error("Tidak dapat menghapus Administrator terakhir di sistem.");
      return;
    }
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Handle Delete User
  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const res = await deleteUserAction(selectedUser.id);

      if (!res.success) {
        toast.error(res.error || "Gagal menghapus pengguna.");
        return;
      }

      toast.success(`Pengguna ${selectedUser.fullName} (${selectedUser.email}) berhasil dihapus.`);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan sistem saat menghapus pengguna.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Akses & Keamanan
            </span>
            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 text-[10px]">
              Khusus Admin
            </Badge>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            Pengelolaan Pengguna
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola akun administrator dan member, kelola hak akses peran, atur ulang kata sandi, serta pantau aktivitas pengguna.
          </p>
        </div>

        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="gap-2 shadow-xs shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Tambah Pengguna</span>
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-md border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Pengguna
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <UserCog className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-foreground mt-2">
            {totalUsers}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Akun terdaftar dalam database
          </p>
        </div>

        <div className="rounded-md border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Administrator
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-foreground mt-2">
            {adminCount}
          </p>
          <p className="text-xs text-emerald-700 mt-0.5">
            Hak akses penuh ke seluruh modul panel admin
          </p>
        </div>

        <div className="rounded-md border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Member / Anggota
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-800">
              <User className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-foreground mt-2">
            {memberCount}
          </p>
          <p className="text-xs text-blue-700 mt-0.5">
            Akses ke dashboard member dan tantangan
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-md border border-border">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, atau WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Button
            size="sm"
            variant={roleFilter === "all" ? "default" : "outline"}
            onClick={() => setRoleFilter("all")}
            className="text-xs h-8 flex-1 sm:flex-none"
          >
            Semua ({totalUsers})
          </Button>
          <Button
            size="sm"
            variant={roleFilter === "admin" ? "default" : "outline"}
            onClick={() => setRoleFilter("admin")}
            className="text-xs h-8 flex-1 sm:flex-none"
          >
            Admin ({adminCount})
          </Button>
          <Button
            size="sm"
            variant={roleFilter === "member" ? "default" : "outline"}
            onClick={() => setRoleFilter("member")}
            className="text-xs h-8 flex-1 sm:flex-none"
          >
            Member ({memberCount})
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border border-border bg-white overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[300px]">Pengguna</TableHead>
              <TableHead className="w-[140px]">Peran (Role)</TableHead>
              <TableHead className="w-[180px]">Kontak WhatsApp</TableHead>
              <TableHead className="w-[180px]">Terdaftar Pada</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                    <UserCog className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">Tidak ada data pengguna yang sesuai.</p>
                    {search && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearch("")}
                        className="text-xs"
                      >
                        Reset Pencarian
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => {
                const isSelf = u.id === currentUserId;
                const isAdmin = u.role === "admin";

                return (
                  <TableRow key={u.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {u.avatarUrl ? (
                          <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-border shadow-xs bg-muted">
                            <Image
                              src={u.avatarUrl}
                              alt={u.fullName}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-xs uppercase tracking-wider ${isAdmin
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                              }`}
                          >
                            {getInitials(u.fullName)}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-foreground text-sm truncate">
                              {u.fullName}
                            </span>
                            {isSelf && (
                              <Badge
                                variant="outline"
                                className="text-[10px] py-0 px-1.5 bg-primary/10 text-primary border-primary/30"
                              >
                                Anda
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {isAdmin ? (
                        <Badge
                          variant="success"
                          className="bg-emerald-50 text-emerald-800 border-emerald-200 gap-1 text-xs font-semibold"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Admin</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-700 border-slate-300 gap-1 text-xs font-medium"
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>Member</span>
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {u.whatsapp ? (
                        <a
                          href={`https://wa.me/${u.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-muted-foreground hover:text-emerald-600 flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3 text-emerald-600" />
                          <span>{u.whatsapp}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                            : "-"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit Role & Name */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(u)}
                          title="Ubah Profil & Peran"
                          className="h-8 px-2 text-xs gap-1"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span className="hidden md:inline">Edit</span>
                        </Button>

                        {/* Reset Password */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReset(u)}
                          title="Atur Ulang Kata Sandi"
                          className="h-8 px-2 text-xs gap-1"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span className="hidden md:inline">Sandi</span>
                        </Button>

                        {/* Delete User */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDelete(u)}
                          disabled={isSelf || (isAdmin && adminCount <= 1)}
                          title={
                            isSelf
                              ? "Anda tidak dapat menghapus akun Anda sendiri"
                              : isAdmin && adminCount <= 1
                                ? "Tidak dapat menghapus Administrator terakhir"
                                : "Hapus Pengguna"
                          }
                          className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL: Tambah Pengguna Baru */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <span>Tambah Pengguna Baru</span>
            </DialogTitle>
            <DialogDescription>
              Buat akun pengguna baru di Supabase Auth dan tetapkan peran (Admin / Member).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            {/* Foto Profil */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Foto Profil (Opsional)
              </label>
              <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/20">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center shrink-0 shadow-xs">
                  {createForm.avatarUrl ? (
                    <Image
                      src={createForm.avatarUrl}
                      alt="Preview Foto"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <Camera className="h-6 w-6 text-muted-foreground/60" />
                  )}
                  {uploadingTarget === "create" && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={uploadingTarget !== null || isSubmitting}
                        onChange={(e) => handlePhotoChange(e, "create")}
                      />
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                        <Upload className="h-3.5 w-3.5" />
                        {createForm.avatarUrl ? "Ganti Foto" : "Unggah Foto"}
                      </span>
                    </label>

                    {createForm.avatarUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCreateForm((prev) => ({ ...prev, avatarUrl: "" }))
                        }
                        disabled={uploadingTarget !== null || isSubmitting}
                        className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Hapus
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Format JPG, JPEG, PNG, WEBP. Maksimal 2 MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nama Lengkap <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Contoh: Rian Pratama"
                value={createForm.fullName}
                onChange={(e) =>
                  setCreateForm({ ...createForm, fullName: e.target.value })
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Alamat Email <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder="email@rumahliterasi.web.id"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm({ ...createForm, email: e.target.value })
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Kata Sandi Baru <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showCreatePassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter..."
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  disabled={isSubmitting}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCreatePassword(!showCreatePassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showCreatePassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Pengguna dapat langsung masuk dengan email dan kata sandi ini.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nomor WhatsApp (Opsional)
              </label>
              <Input
                placeholder="Contoh: 08123456789"
                value={createForm.whatsapp}
                onChange={(e) =>
                  setCreateForm({ ...createForm, whatsapp: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Peran Pengguna (Role) <span className="text-destructive">*</span>
              </label>
              <Select
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    role: e.target.value as "admin" | "member",
                  })
                }
                disabled={isSubmitting}
              >
                <option value="member">Member (Akses Dashboard Literasi)</option>
                <option value="admin">Administrator (Akses Penuh Seluruh Panel)</option>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Simpan Pengguna</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Edit Pengguna & Peran */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />
              <span>Edit Pengguna & Peran</span>
            </DialogTitle>
            <DialogDescription>
              Perbarui nama, WhatsApp, dan peran otorisasi untuk akun{" "}
              <strong>{selectedUser?.email}</strong>.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Foto Profil */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Foto Profil
                </label>
                <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/20">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center shrink-0 shadow-xs">
                    {editForm.avatarUrl ? (
                      <Image
                        src={editForm.avatarUrl}
                        alt="Preview Foto"
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <Camera className="h-6 w-6 text-muted-foreground/60" />
                    )}
                    {uploadingTarget === "edit" && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={uploadingTarget !== null || isSubmitting}
                          onChange={(e) => handlePhotoChange(e, "edit")}
                        />
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                          <Upload className="h-3.5 w-3.5" />
                          {editForm.avatarUrl ? "Ganti Foto" : "Unggah Foto"}
                        </span>
                      </label>

                      {editForm.avatarUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setEditForm((prev) => ({ ...prev, avatarUrl: "" }))
                          }
                          disabled={uploadingTarget !== null || isSubmitting}
                          className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Hapus Foto
                        </Button>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Format JPG, JPEG, PNG, WEBP. Maksimal 2 MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <Input
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nomor WhatsApp
                </label>
                <Input
                  value={editForm.whatsapp}
                  onChange={(e) =>
                    setEditForm({ ...editForm, whatsapp: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Peran Pengguna (Role) <span className="text-destructive">*</span>
                </label>
                <Select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      role: e.target.value as "admin" | "member",
                    })
                  }
                  disabled={
                    isSubmitting ||
                    (selectedUser.id === currentUserId &&
                      selectedUser.role === "admin")
                  }
                >
                  <option value="member">Member (Akses Dashboard Literasi)</option>
                  <option value="admin">Administrator (Akses Penuh Seluruh Panel)</option>
                </Select>
                {selectedUser.id === currentUserId && selectedUser.role === "admin" && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                    Anda tidak dapat mendowngrade peran akun Anda sendiri saat sedang masuk.
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL: Reset Kata Sandi */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <span>Atur Ulang Kata Sandi</span>
            </DialogTitle>
            <DialogDescription>
              Masukkan kata sandi baru untuk akun pengguna{" "}
              <strong>{selectedUser?.email}</strong>.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kata Sandi Baru <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Minimal 8 karakter..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Kata sandi baru akan langsung berlaku untuk proses login berikutnya.
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setResetDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Mengubah...</span>
                    </>
                  ) : (
                    <span>Update Kata Sandi</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL: Konfirmasi Hapus Pengguna */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>Konfirmasi Hapus Pengguna</span>
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus akun pengguna ini dari sistem?
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20 text-xs space-y-1 text-destructive">
                <p className="font-semibold">{selectedUser.fullName}</p>
                <p>{selectedUser.email}</p>
                <p className="text-[11px] opacity-80">
                  Tindakan ini permanen dan akan menghapus akun dari otentikasi serta profil terkait.
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Hapus Permanen</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
