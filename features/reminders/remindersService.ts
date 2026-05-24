import { supabase } from "@/services/supabase";
import { getCurrentUser } from "../auth/authService";

export type Reminder = {
    id: string;
    pet_id: string;
    user_id?: string;
    title: string;
    description?: string | null;
    reminder_time: string;
    is_completed?: boolean;
    notification_id?: string | null;
    created_at?: string;
    updated_at?: string;
};

export const getReminders = async (petId: string) => {
    const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("pet_id", petId)
        .order("reminder_time", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data as Reminder[];
};

export const createReminder = async (reminder: Omit<Reminder, "id" | "user_id" | "created_at" | "updated_at">) => {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
        .from("reminders")
        .insert([
            {
                ...reminder,
                user_id: user.id,
            },
        ])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Reminder;
};

export const updateReminder = async (id: string, updates: Partial<Omit<Reminder, "id" | "user_id">>) => {
    const { data, error } = await supabase
        .from("reminders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Reminder;
};

export const deleteReminder = async (id: string) => {
    const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
};