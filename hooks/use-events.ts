"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Event, EventRegistration } from "@/lib/types/database.types";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchEvents = useCallback(async (options?: {
    status?: string;
    game?: string;
    limit?: number;
  }) => {
    setLoading(true);
    let query = supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true });

    if (options?.status) {
      query = query.eq("status", options.status);
    }
    if (options?.game) {
      query = query.eq("game", options.game);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
    return { data, error: error?.message };
  }, [supabase]);

  const getEvent = async (id: string) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error: error?.message };
  };

  const getEventBySlug = async (slug: string) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    return { data, error: error?.message };
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    fetchEvents,
    getEvent,
    getEventBySlug,
  };
}

export function useMyEvents(userId: string | undefined) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchMyEvents = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("event_registrations")
      .select(`
        *,
        event:events(*)
      `)
      .eq("user_id", userId)
      .order("registered_at", { ascending: false });

    if (!error && data) {
      setRegistrations(data);
    }
    setLoading(false);
  }, [supabase, userId]);

  const registerForEvent = async (eventId: string, teamId?: string) => {
    if (!userId) return { error: "Not authenticated" };

    const { data, error } = await supabase
      .from("event_registrations")
      .insert({
        event_id: eventId,
        user_id: userId,
        team_id: teamId,
        status: "pending",
      })
      .select()
      .single();

    if (!error) {
      await fetchMyEvents();
    }

    return { data, error: error?.message };
  };

  const cancelRegistration = async (registrationId: string) => {
    const { error } = await supabase
      .from("event_registrations")
      .update({ status: "cancelled" })
      .eq("id", registrationId)
      .eq("user_id", userId);

    if (!error) {
      await fetchMyEvents();
    }

    return { error: error?.message };
  };

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  return {
    registrations,
    loading,
    fetchMyEvents,
    registerForEvent,
    cancelRegistration,
  };
}
