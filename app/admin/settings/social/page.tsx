"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Share2, 
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Twitch,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

interface SocialLinks {
  id?: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  twitch: string;
  discord: string;
  tiktok: string;
  whatsapp: string;
  [key: string]: string | undefined;
}

const socialConfig = [
  { key: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600", placeholder: "https://facebook.com/bagoesesports" },
  { key: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-500", placeholder: "https://instagram.com/bagoesesports" },
  { key: "twitter", label: "Twitter / X", icon: Twitter, color: "text-sky-500", placeholder: "https://twitter.com/bagoesesports" },
  { key: "youtube", label: "YouTube", icon: Youtube, color: "text-red-500", placeholder: "https://youtube.com/@bagoesesports" },
  { key: "twitch", label: "Twitch", icon: Twitch, color: "text-purple-500", placeholder: "https://twitch.tv/bagoesesports" },
  { key: "discord", label: "Discord", icon: MessageCircle, color: "text-indigo-500", placeholder: "https://discord.gg/bagoesesports" },
  { key: "tiktok", label: "TikTok", icon: LinkIcon, color: "text-foreground", placeholder: "https://tiktok.com/@bagoesesports" },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-green-500", placeholder: "+62 812-3456-7890" },
];

export default function SocialMediaPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [links, setLinks] = useState<SocialLinks>({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    twitch: "",
    discord: "",
    tiktok: "",
    whatsapp: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .single();
    
    if (!error && data) {
      setLinks(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, [supabase]);

  const handleSave = async () => {
    if (!supabase) return;
    
    setSaving(true);
    setError(null);
    
    const { data: existing } = await supabase
      .from("social_links")
      .select("id")
      .single();
    
    let error;
    
    if (existing?.id) {
      const result = await supabase
        .from("social_links")
        .update({
          facebook: links.facebook,
          instagram: links.instagram,
          twitter: links.twitter,
          youtube: links.youtube,
          twitch: links.twitch,
          discord: links.discord,
          tiktok: links.tiktok,
          whatsapp: links.whatsapp,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("social_links")
        .insert({
          facebook: links.facebook,
          instagram: links.instagram,
          twitter: links.twitter,
          youtube: links.youtube,
          twitch: links.twitch,
          discord: links.discord,
          tiktok: links.tiktok,
          whatsapp: links.whatsapp,
        });
      error = result.error;
    }
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Link sosial media berhasil disimpan!");
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setSaving(false);
  };

  const updateLink = (key: string, value: string) => {
    setLinks({ ...links, [key]: value });
  };

  return (
    <div>
      <PageHeader
        title="Pengaturan Social Media"
        description="Kelola link sosial media website"
        icon={Share2}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pengaturan", href: "/admin/settings" },
          { label: "Social Media" },
        ]}
        actions={
          <Button variant="gradient" className="gap-2" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </Button>
        }
      />

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {socialConfig.map((social) => {
            const IconComponent = social.icon;
            return (
              <Card key={social.key}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${social.color}`} />
                    </div>
                    <div>
                      <p className="font-bold">{social.label}</p>
                      <p className="text-xs text-muted-foreground">Link atau username</p>
                    </div>
                  </div>
                  <Input
                    placeholder={social.placeholder}
                    value={(links as Record<string, string>)[social.key] || ""}
                    onChange={(e) => updateLink(social.key, e.target.value)}
                  />
                  {(links as Record<string, string>)[social.key] && (
                    <a 
                      href={(links as Record<string, string>)[social.key].startsWith("http") 
                        ? (links as Record<string, string>)[social.key] 
                        : `https://${(links as Record<string, string>)[social.key]}`}
                      target="_blank"
                      className="text-xs text-primary mt-2 inline-block hover:underline"
                    >
                      Lihat link →
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
