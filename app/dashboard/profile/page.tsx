"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Camera,
  Shield,
  CheckCircle,
  Lock,
} from "lucide-react";

const userData = {
  name: "John Doe",
  username: "playerone",
  email: "john@example.com",
  phone: "+62 812-3456-7890",
  location: "Jakarta, Indonesia",
  bio: "Pemain esports profesional | Valorant enthusiast | Mencari tim kompetitif",
  joinDate: "2025-01-15",
  isVerified: true,
  level: 25,
  rank: "Gold",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    username: userData.username,
    email: userData.email,
    phone: userData.phone,
    location: userData.location,
    bio: userData.bio,
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Profil Saya</h1>
            <p className="text-muted-foreground">Kelola informasi profil Anda</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">
                      {userData.name.charAt(0)}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                    {userData.isVerified && (
                      <CheckCircle className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">@{userData.username}</p>
                  <div className="flex gap-2">
                    <Badge className="bg-primary/20 text-primary">
                      Level {userData.level}
                    </Badge>
                    <Badge className="bg-accent/20 text-accent">
                      {userData.rank}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant={isEditing ? "gradient" : "outline"}
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Simpan
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nama Lengkap
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    ) : (
                      <p className="p-3 rounded-lg bg-muted/50">{formData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Username
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                      />
                    ) : (
                      <p className="p-3 rounded-lg bg-muted/50">
                        @{formData.username}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    ) : (
                      <p className="p-3 rounded-lg bg-muted/50">{formData.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Telepon
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    ) : (
                      <p className="p-3 rounded-lg bg-muted/50">{formData.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Lokasi
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  ) : (
                    <p className="p-3 rounded-lg bg-muted/50">{formData.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  {isEditing ? (
                    <Textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="p-3 rounded-lg bg-muted/50">{formData.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Ubah Kata Sandi
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  {showPasswordForm ? "Batal" : "Ubah"}
                </Button>
              </div>

              {showPasswordForm && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Kata Sandi Saat Ini
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Kata Sandi Baru
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Konfirmasi Kata Sandi
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Button variant="gradient">Simpan Kata Sandi</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verification Status */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Verifikasi Akun
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email</span>
                  <Badge className="bg-accent/20 text-accent">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Terverifikasi
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Telepon</span>
                  <Badge className="bg-muted text-muted-foreground">
                    Belum Verifikasi
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Verifikasi Telepon
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Informasi Akun</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bergabung</span>
                  <span>
                    {new Date(userData.joinDate).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-bold">{userData.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rank</span>
                  <Badge className="bg-accent/20 text-accent">
                    {userData.rank}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
