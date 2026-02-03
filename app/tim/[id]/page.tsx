import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { teams } from "@/lib/data";
import { TeamHeader } from "@/components/teams/TeamHeader";
import { TeamMembers } from "@/components/teams/TeamMembers";
import { TeamAchievements } from "@/components/teams/TeamAchievements";
import { TeamSidebar } from "@/components/teams/TeamSidebar";

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

  return (
    <div className="min-h-screen pt-20">
      <TeamHeader team={team} />

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <TeamMembers members={team.members} />
              <TeamAchievements achievements={team.achievements} />
            </div>

            {/* Right Column */}
            <TeamSidebar team={team} />
          </div>
        </div>
      </section>
    </div>
  );
}
