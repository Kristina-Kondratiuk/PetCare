import { cancelLocalNotification, scheduleLocalNotification } from "@/services/notificationService";
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

export const getAllReminders = async () => {
    const user = await getCurrentUser();
  
    if (!user) {
        throw new Error("User not authenticated");
    }
  
    const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("reminder_time", { ascending: true });
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data as Reminder[];
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

    const notificationId = await scheduleLocalNotification({
        title: reminder.title,
        body: reminder.description ?? undefined,
        date: new Date(reminder.reminder_time),
    });

    const { data, error } = await supabase
        .from("reminders")
        .insert([
            {
                ...reminder,
                user_id: user.id,
                notification_id: notificationId,
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
    const { data: reminder, error: fetchError } = await supabase
        .from("reminders")
        .select("notification_id")
        .eq("id", id)
        .single();
    
    if (fetchError) {
        throw new Error(fetchError.message);
    }

    if (reminder?.notification_id) {
        await cancelLocalNotification(reminder.notification_id);
    }

    const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
};