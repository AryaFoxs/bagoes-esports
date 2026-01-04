"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Team, TeamMember } from "@/lib/types/database.types";

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTeams = useCallback(async (options?: {
    game?: string;
    isRecruiting?: boolean;
    limit?: number;
  }) => {
    setLoading(true);
    let query = supabase
      .from("teams")
      .select("*")
      .order("created_at", { ascending: false });

    if (options?.game) {
      query = query.eq("game", options.game);
    }
    if (options?.isRecruiting !== undefined) {
      query = query.eq("is_recruiting", options.isRecruiting);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (!error && data) {
      setTeams(data);
    }
    setLoading(false);
    return { data, error: error?.message };
  }, [supabase]);

  const getTeam = async (id: string) => {
    const { data, error } = await supabase
      .from("teams")
      .select(`
        *,
        members:team_members(*, profile:profiles(*))
      `)
      .eq("id", id)
      .single();

    return { data, error: error?.message };
  };

  const getTeamBySlug = async (slug: string) => {
    const { data, error } = await supabase
      .from("teams")
      .select(`
        *,
        members:team_members(*, profile:profiles(*))
      `)
      .eq("slug", slug)
      .single();

    return { data, error: error?.message };
  };

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    loading,
    fetchTeams,
    getTeam,
    getTeamBySlug,
  };
}

export function useMyTeams(userId: string | undefined) {
  const [memberships, setMemberships] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchMyTeams = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select(`
        *,
        team:teams(*)
      `)
      .eq("user_id", userId)
      .eq("status", "active")
      .order("joined_at", { ascending: false });

    if (!error && data) {
      setMemberships(data);
    }
    setLoading(false);
  }, [supabase, userId]);

  const createTeam = async (teamData: {
    name: string;
    game: string;
    description?: string;
    region?: string;
    is_recruiting?: boolean;
  }) => {
    if (!userId) return { error: "Not authenticated" };

    const slug = teamData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Create team
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        ...teamData,
        slug,
        created_by: userId,
      })
      .select()
      .single();

    if (teamError) return { error: teamError.message };

    // Add creator as captain
    const { error: memberError } = await supabase
      .from("team_members")
      .insert({
        team_id: team.id,
        user_id: userId,
        role: "captain",
        status: "active",
      });

    if (!memberError) {
      await fetchMyTeams();
    }

    return { data: team, error: memberError?.message };
  };

  const leaveTeam = async (teamId: string) => {
    if (!userId) return { error: "Not authenticated" };

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", teamId)
      .eq("user_id", userId);

    if (!error) {
      await fetchMyTeams();
    }

    return { error: error?.message };
  };

  const joinTeam = async (teamId: string) => {
    if (!userId) return { error: "Not authenticated" };

    const { data, error } = await supabase
      .from("team_members")
      .insert({
        team_id: teamId,
        user_id: userId,
        role: "member",
        status: "pending",
      })
      .select()
      .single();

    return { data, error: error?.message };
  };

  useEffect(() => {
    fetchMyTeams();
  }, [fetchMyTeams]);

  return {
    memberships,
    loading,
    fetchMyTeams,
    createTeam,
    leaveTeam,
    joinTeam,
  };
}
