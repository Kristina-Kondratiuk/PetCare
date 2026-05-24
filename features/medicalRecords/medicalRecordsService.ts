import { supabase } from "@/services/supabase";

export type MedicalRecord = {
    id: string;
    pet_id: string;
    title: string;
    type: string;
    record_date: string;
    notes?: string;
};

export const getMedicalRecords = async (petId: string) => {
    const { data, error } = await supabase
        .from("medical_records")
        .select("*")
        .eq("pet_id", petId)
        .order("record_date", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data as MedicalRecord[];
};

export const createMedicalRecord = async (record: Omit<MedicalRecord, "id">) => {
    const { data: userData, error: userError } =
        await supabase.auth.getUser();

    if (userError) {
        throw new Error(userError.message);
    }

    if (!userData.user) {
        throw new Error("User must be logged in");
    }

    const { data, error } = await supabase
        .from("medical_records")
        .insert([
            {
                ...record,
                user_id: userData.user.id,
            },
        ])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as MedicalRecord;
};

export const updateMedicalRecord = async (id: string, updates: Partial<Omit<MedicalRecord, "id">>) => {
    const { data, error } = await supabase
        .from("medical_records")
        .update(updates)
        .eq("is", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as MedicalRecord;
};

export const deleteMedicalRecord = async (id: string) => {
    const { error } = await supabase
        .from("medical_records")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
};