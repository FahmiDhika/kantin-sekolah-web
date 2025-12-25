export interface IMenu {
  id: number;
  nama_menu: string;
  deskripsi: string;
  jenis: string;
  foto: string;
  is_active: boolean;

  harga: number;
  harga_asli: number;
  harga_diskon: number;
  is_diskon: boolean;
  persentase?: number;

  diskon?: {
    id: number;
    nama_diskon: string;
    persentase: number;
  } | null;
}

export interface IMenuDiskon {
  id: number;
  id_menu: number;
  id_diskon: number;
  menu: IMenu;
}

export interface IDiskon {
  id: number;
  nama_diskon: string;
  persentase: number;
  tanggal_awal: string;
  tanggal_akhir: string;
  id_stan: number;
  menu_diskon?: IMenuDiskon[];
}

export interface IUserLogin {
  id: number;
  username: string;
  role: "ADMIN_STAN" | "SISWA";

  stan: IStanLogin[];
  siswa: {
    id: number;
    uuid: string;
    nama: string;
    alamat: string;
    telepon: string;
    foto: string;
  }[];
}

export interface IUsers {
  id: number;
  username: string;
  password: string;
  role: string;

  siswa: ISiswa[];
  stan: IStan[];

  createdAt: string;
  updatedAt: string;
}

export interface IDeleteUser {
  id: number;
  username: string;
}

export interface IStanLogin {
  id: number;
  nama_stan: string;
  nama_pemilik: string;
  telepon: string;
}

export interface IStan {
  id: number;
  nama_stan: string;
  nama_pemilik: string;
  telepon: string;

  id_user: number;
}

export interface ISiswa {
  id: number;
  uuid: string;
  nama: string;
  alamat: string;
  telepon: string;
  foto: string;

  id_user: number;
}

export interface IUpdateUser {
  username: string;
  password?: string;
}
