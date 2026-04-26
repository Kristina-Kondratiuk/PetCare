import { supabase } from "@/services/supabase";

export type Pet = {
    id: string;
    name: string;
    type: string;
    breed?: string;
    birth_date?: string;
    weight?: string;
    photo_url?: string;
    notes?: string;
};

// GET ALL PETS
export const getPets= async () => {
    const { data, error } = await supabase
        .from("pets")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data as Pet[];
};

// CREATE PET
export const createPet = async (pet: Omit<Pet, "id">) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
        throw new Error(userError.message);
    }

    if (!userData.user) {
        throw new Error("User must be logged in to create a pet");
    }

    const { data, error } = await supabase
        .from("pets")
        .insert([
            {
                ...pet,
                user_id: userData.user.id,
            },
        ])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Pet;
};

// UPDATE PET
export const updatePet = async (id: string, updates: Partial<Omit<Pet, "id">>) => {
    const { data, error } = await supabase
        .from("pets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Pet;
};

// DELETE PET
export const deletePet = async (id: string) => {
    const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
};