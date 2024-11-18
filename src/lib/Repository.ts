import { supabase } from "./supabaseClient";

export async function getSignedInUser() {
  return supabase.auth.getUser();
}

export async function isUserSignedIn() {
  const loggedIn = await supabase.auth.getSession();
  return loggedIn.data.session !== null;
}

export async function signUpNewUser(
  displayName: string,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });
  return { data, error };
}

export async function signInUser(
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  return { data, error };
}

export async function signOutUser() {
  return await supabase.auth.signOut();
}

export async function getUserProfile(userId: string) {
  // Fetch regular game stats (game_type_id = 1)
  const { data: regularStats, error: regularError } =
    await supabase
      .from("profile_stats")
      .select("*")
      .eq("profile_id", userId)
      .eq("game_type_id", 1)
      .single();

  // Fetch blitz game stats (game_type_id = 2)
  const { data: blitzStats, error: blitzError } = await supabase
    .from("profile_stats")
    .select("*")
    .eq("profile_id", userId)
    .eq("game_type_id", 2)
    .single();

  if (regularError || blitzError) {
    throw new Error("Error fetching user profile");
  }

  // Combine the stats into one object
  return {
    data: {
      regular: regularStats || null,
      blitz: blitzStats || null,
    },
    error: null,
  };
}

export async function updateUserProfilePicture(file: File) {
  const pfpBucketName = import.meta.env
    .VITE_SUPABASE_BUCKET_NAME;
  // Get the currently signed in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not found");
  }
  const userId = user.id;

  const fileName = crypto.randomUUID();

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from(pfpBucketName)
    .upload(`${userId}/${fileName}`, file);

  if (uploadError) {
    throw uploadError;
  }

  // Get public URL for uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage
    .from(pfpBucketName)
    .getPublicUrl(`${userId}/${fileName}`);

  // Update user profile with new picture URL
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ profile_picture: publicUrl })
    .eq("id", userId);

  if (updateError) {
    throw updateError;
  }
}

export async function getGameRank(
  gameId: number,
  gameType: string
) {
  return await supabase
    .from("game_rankings")
    .select("*")
    .eq("id", gameId)
    .eq("game_type_id", gameType);
}

export async function getLeaderboard(
  gameType?: "regular" | "blitz"
) {
  let query = supabase
    .from("leaderboard")
    .select("*")
    .order("bps", { ascending: false });

  if (gameType) {
    query = query.eq("type_name", gameType);
  }

  return query;
}

export async function addPlayedGame({
  bps,
  gameType,
}: {
  bps: number;
  gameType: string;
}) {
  // Get the currently signed in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting user:", userError);
    return;
  }
  console.log(gameType);

  // Get game type id from game type name
  const { data: gameTypeData, error: gameTypeError } =
    await supabase
      .from("game_types")
      .select("id")
      .eq("type_name", gameType);

  if (gameTypeError) {
    console.error("Error getting game type id:", gameTypeError);
    return;
  }

  if (!gameTypeData || gameTypeData.length === 0) {
    console.error("Game type not found", gameTypeError);
    return;
  }

  const playedGameWithGameTypeId = {
    bps,
    game_type_id: gameTypeData[0].id,
    user_id: user.id,
  };

  return supabase
    .from("played_games")
    .insert(playedGameWithGameTypeId)
    .select()
    .single();
}
