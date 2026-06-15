import { supabase } from "@/services/supabase";

export type UserProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
  created_at?: string;
  updated_at?: string;
};

export const getProfile = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile;
};

export const upsertProfile = async (
  profile: Pick<UserProfile, "first_name" | "last_name" | "photo_url">
) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userData.user.id,
      email: userData.user.email ?? "",
      first_name: profile.first_name,
      last_name: profile.last_name,
      photo_url: profile.photo_url,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile;
};

export const uploadProfilePhoto = async (imageUri: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!userData.user) throw new Error("User not authenticated");

  const response = await fetch(imageUri);
  const arrayBuffer = await response.arrayBuffer();

  const fileExt = imageUri.split(".").pop() ?? "jpg";
  const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-photos")
    .upload(fileName, arrayBuffer, {
      contentType: `image/${fileExt}`,
      upsert: true,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage
    .from("profile-photos")
    .getPublicUrl(fileName);

  return data.publicUrl;
};