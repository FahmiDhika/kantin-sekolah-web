import { getCookies } from "@/lib/server-cookie";
import { get } from "@/lib/api-bridge";
import { BASE_API_URL } from "@/global";
import { IUserLogin } from "@/app/types";

const getProfile = async (): Promise<IUserLogin | null> => {
  try {
    const TOKEN = await getCookies("token");
    const url = `${BASE_API_URL}/user/getLogin`;

    const res = await get(url, TOKEN);

    if (res?.data?.status) {
      return res.data.data; // OBJECT
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

  return (
    <div className="p-6 max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Informasi akun yang sedang login
        </h1>
      </div>

      {/* Card Akun */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Informasi Akun
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-medium text-gray-800">{profile.username}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
              {profile.role}
            </span>
          </div>
        </div>
      </div>

      {/* ADMIN STAN */}
      {profile.role === "ADMIN_STAN" && profile.stan.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Data Stan
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nama Stan</p>
              <p className="font-medium">{profile.stan[0].nama_stan}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Nama Pemilik</p>
              <p className="font-medium">{profile.stan[0].nama_pemilik}</p>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-gray-500">Telepon</p>
              <p className="font-medium">{profile.stan[0].telepon}</p>
            </div>
          </div>
        </div>
      )}

      {/* SISWA */}
      {profile.role === "SISWA" && profile.siswa.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Data Siswa
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nama</p>
              <p className="font-medium">{profile.siswa[0].nama}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Telepon</p>
              <p className="font-medium">{profile.siswa[0].telepon}</p>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-gray-500">Alamat</p>
              <p className="font-medium">{profile.siswa[0].alamat}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
