export interface IMenu {
  id: number;
  nama_menu: string;
  deskripsi: string;
  jenis: "MAKANAN" | "MINUMAN";
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
