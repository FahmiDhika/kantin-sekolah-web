// app/profile/page.tsx
import { getCookies } from "@/lib/server-cookie";
import { get } from "@/lib/api-bridge";
import { BASE_API_URL } from "@/global";
import { IUserLogin } from "@/app/types";
import ProfileUserClient from "./profileUser";
import ProfileStanClient from "./profileStan";

const getProfile = async (): Promise<IUserLogin | null> => {
  try {
    const TOKEN = await getCookies("token");
    const url = `${BASE_API_URL}/user/getLogin`;

    const res = await get(url, TOKEN);

    if (res?.data?.status) {
      return res.data.data;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const ProfilePage = async () => {
  const profile = await getProfile();

  if (!profile) {
    return <div>Gagal memuat data profile</div>;
  }

  const stan = profile.stan?.[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <p className="text-sm text-muted-foreground">Update data akun anda.</p>

      <ProfileUserClient profile={profile} />

      {profile.role === "ADMIN_STAN" && stan && (
        <ProfileStanClient stan={stan} />
      )}
    </div>
  );
};

export default ProfilePage;
