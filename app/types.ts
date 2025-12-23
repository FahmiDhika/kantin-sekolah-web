export interface IMenu {
  id: number;
  nama_menu: string;
  harga: number;
  jenis: string;
  foto: string;
  deskripsi: string;
  id_stan: number;
  is_active: boolean;
  has_diskon: boolean;
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
