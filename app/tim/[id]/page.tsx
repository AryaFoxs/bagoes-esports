import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { teams } from "@/lib/data";
import {
  Trophy,
  Users,
  Shield,
  MapPin,
  Calendar,
  Medal,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Globe,
  ArrowLeft,
  UserPlus,
  ChevronRight,
} from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TeamDetailPage({ params }: Props) {
  const { id } = await params;
  const team = teams.find((t) => t.id === id);

  if (!team) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Tim tidak ditemukan</h1>
          <p className="text-muted-foreground mb-6">
            Tim yang Anda cari tidak ada atau sudah dihapus.
          </p>
          <Button asChild>
            <Link href="/tim">Kembali ke Daftar Tim</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return Twitter;
      case "instagram":
        return Instagram;
      case "youtube":
        return Youtube;
      case "discord":
        return MessageCircle;
      default:
        return Globe;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Banner */}
      <section className="relative h-64 md:h-80 bg-gradient-to-br from-primary/30 to-secondary/30 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        <div className="container mx-auto px-4 lg:px-8 relative h-full flex items-end pb-8">
          <Button variant="ghost" size="sm" className="absolute top-8 left-4" asChild>
            <Link href="/tim" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </Button>
        </div>
      </section>

      {/* Team Header */}
      <section className="relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 -mt-16 relative">
            {/* Team Logo */}
            <div className="w-32 h-32 rounded-2xl bg-card border-4 border-background shadow-lg flex items-center justify-center">
              <Shield className="w-16 h-16 text-primary" />
            </div>

            {/* Team Info */}
            <div className="flex-1 pt-4 md:pt-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {team.name}
                    </h1>
                    {team.isRecruiting && (
                      <Badge variant="success">Rekrutmen Dibuka</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <Badge variant="secondary">{team.game}</Badge>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {team.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Est. {team.founded}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {team.isRecruiting && (
                    <Button variant="gradient" className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      Join Team
                    </Button>
                  )}
                  <Button variant="outline">Follow</Button>
                </div>
              </div>

              <p className="mt-4 text-muted-foreground max-w-2xl">
                {team.description}
              </p>

              {/* Social Links */}
              {team.socialLinks && (
                <div className="flex items-center gap-2 mt-4">
                  {Object.entries(team.socialLinks).map(([platform, url]) => {
                    const Icon = getSocialIcon(platform);
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Members */}
            <div className="lg:col-span-2 space-y-8">
              {/* Team Members */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Anggota Tim
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {team.members.map((member, index) => (
                    <Card key={member.id} hover className="group">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Users className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{member.nickname}</h3>
                            {index === 0 && (
                              <Badge variant="default" className="text-xs">
                                Captain
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {member.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.name} • {member.country}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-accent" />
                  Pencapaian
                </h2>

                {team.achievements.length > 0 ? (
                  <div className="space-y-4">
                    {team.achievements.map((achievement) => (
                      <Card key={achievement.id}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                            <Medal className="w-6 h-6 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {achievement.tournament}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                achievement.placement === "Champion"
                                  ? "success"
                                  : "outline"
                              }
                            >
                              {achievement.placement}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(achievement.date).toLocaleDateString(
                                "id-ID",
                                {
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        Belum ada pencapaian yang tercatat.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Statistik Tim</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Anggota</span>
                      <span className="font-bold">{team.members.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pencapaian</span>
                      <span className="font-bold">
                        {team.achievements.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Game</span>
                      <Badge variant="secondary">{team.game}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Region</span>
                      <span className="font-bold">{team.region}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Didirikan</span>
                      <span className="font-bold">{team.founded}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recruiting */}
              {team.isRecruiting && team.recruitingRoles && (
                <Card className="border-accent/30 bg-accent/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <UserPlus className="w-5 h-5 text-accent" />
                      <h3 className="font-bold">Posisi Tersedia</h3>
                    </div>
                    <div className="space-y-2 mb-4">
                      {team.recruitingRoles.map((role) => (
                        <div
                          key={role}
                          className="flex items-center gap-2 p-2 rounded-lg bg-background"
                        >
                          <ChevronRight className="w-4 h-4 text-accent" />
                          <span>{role}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="success" className="w-full">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Contact */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Hubungi Tim</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tertarik untuk berkolaborasi atau mensponsori tim ini?
                  </p>
                  <Button variant="outline" className="w-full">
                    Kirim Pesan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
