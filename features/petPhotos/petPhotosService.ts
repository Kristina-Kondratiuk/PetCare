import { supabase } from "@/services/supabase";

export type PetPhoto = {
  id: string;
  pet_id: string;
  user_id: string;
  photo_url: string;
  created_at?: string;
};

export const getAllPetPhotos = async () => {
  const { data, error } = await supabase
    .from("pet_photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as PetPhoto[];
};

export const getPetPhotos = async (petId: string) => {
  const { data, error } = await supabase
    .from("pet_photos")
    .select("*")
    .eq("pet_id", petId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as PetPhoto[];
};

export const addPetPhoto = async (petId: string, photoUrl: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("pet_photos")
    .insert([
      {
        pet_id: petId,
        user_id: userData.user.id,
        photo_url: photoUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PetPhoto;
};

export const uploadPetPhoto = async (petId: string, imageUri: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(imageUri);
  const arrayBuffer = await response.arrayBuffer();

  const fileExt = imageUri.split(".").pop() ?? "jpg";
  const fileName = `${userData.user.id}/${petId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("pet-photos")
    .upload(fileName, arrayBuffer, {
      contentType: `image/${fileExt}`,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("pet-photos").getPublicUrl(fileName);

  return await addPetPhoto(petId, data.publicUrl);
};

export const deletePetPhoto = async (photo: PetPhoto) => {
  const filePath = photo.photo_url.split("/pet-photos/")[1];

  if (filePath) {
    await supabase.storage.from("pet-photos").remove([filePath]);
  }

  const { error } = await supabase
    .from("pet_photos")
    .delete()
    .eq("id", photo.id);

  if (error) {
    throw new Error(error.message);
  }

  return photo.id;
};
