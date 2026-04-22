import { supabase } from "@/services/supabase";

type LoginData = {
    email: string;
    password: string;
};

export const login = async ({ email, password }: LoginData) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message);
    }

    if (!data.user) {
        throw new Error("User not found");
    }

    return {
        id: data.user.id,
        email: data.user.email ?? "",
    };
};

export const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }
};

export const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw new Error(error.message);
    }

    if (!data.user) {
        return null;
    }

    return {
        id: data.user.id,
        email: data.user.email ?? "",
    };
};