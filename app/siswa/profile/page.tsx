import { IUserLogin } from "@/app/types";
import { BASE_API_URL, BASE_SUPABASE_URL } from "@/global";
import { get } from "@/lib/api-bridge";
import { getCookies } from "@/lib/server-cookie";
import Image from "next/image";
import avatarDefault from "@/public/avatar-default.svg";
import UpdateFotoProfile from "./updateFotoProfile";
import ProfileSiswaClient from "./profileSiswa";
import ProfileUserClient from "./profileUser";
import DeleteUser from "./deleteUser";

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
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Gagal memuat data profile</p>
      </div>
    );
  }

  const siswa = profile.siswa?.[0];

  return (
    <section className="flex flex-col justify-center items-center gap-5">
      <div className="w-full max-w-3xl bg-white shadow rounded-xl p-6">
        <div className="flex flex-col gap-5 items-center justify-center">
          <Image
            src={
              siswa.foto
                ? `${BASE_SUPABASE_URL}/storage/v1/object/public/siswa/${siswa.foto}`
                : avatarDefault
            }
            alt={avatarDefault}
            width={200}
            height={200}
            className="rounded-full aspect-square object-cover p-1 shadow border-black"
          />
          <UpdateFotoProfile fotoLama={siswa.foto} />
        </div>
        <ProfileSiswaClient siswa={siswa} />
        <ProfileUserClient profile={profile} />
      </div>

      <div className="w-full max-w-3xl">
        <DeleteUser selectedUser={profile} />
      </div>
    </section>
  );
};

export default ProfilePage;
