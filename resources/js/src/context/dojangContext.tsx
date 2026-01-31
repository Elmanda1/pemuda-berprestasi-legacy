// src/context/dojangContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { apiClient } from "../config/api"; // import apiClient

type OptionType = { value: string; label: string };

type Dojang = {
  id_dojang: number;
  nama_dojang: string;
  email: String
  no_telp: String
  founder: String
  negara: String
  provinsi: String
  kota: String
  kecamatan: String
  kelurahan: String
  alamat: String
  jumlah_atlet?: number;
  created_at: string;
  // tambahkan field lain sesuai kebutuhan
};

type DojangContextType = {
  dojangOptions: OptionType[];
  dojangs: Dojang[];
  isLoading: boolean;
  refreshDojang: () => Promise<void>; // <- ubah dari void ke Promise<void>
};

const DojangContext = createContext<DojangContextType>({
  dojangOptions: [],
  dojangs: [],
  isLoading: false,
  refreshDojang: async () => { },
});

export const useDojang = () => useContext(DojangContext);

type Props = { children: ReactNode };

export const DojangProvider = ({ children }: Props) => {
  const [dojangOptions, setDojangOptions] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dojangs, setDojangs] = useState<Dojang[]>([]);

  const fetchDojang = async (): Promise<void> => {
    try {
      const res = await apiClient.get("/dojang/listdojang");
      const data = (res as any).data || res;
      const items = Array.isArray(data) ? data : (data.data || []);

      const options: OptionType[] = items.map((item: any) => ({
        value: item.id_dojang.toString(),
        label: item.nama_dojang,
      })) || [];

      const listDojang: Dojang[] = items.map((item: any) => ({
        id_dojang: item.id_dojang,
        nama_dojang: item.nama_dojang,
        email: item.email,
        no_telp: item.no_telp,
        negara: item.negara,
        provinsi: item.provinsi,
        kota: item.kota,
        alamat: item.alamat,
        jumlah_atlet: item.jumlah_atlet,
        created_at: item.created_at,
      })) || [];

      setDojangOptions(options);
      setDojangs(listDojang);
    } catch (err: any) {
      console.error("Gagal mengambil data dojang:");
      toast.error("Tidak dapat mengambil data dojang");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDojang = async (): Promise<void> => fetchDojang();

  return (
    <DojangContext.Provider value={{ dojangOptions, dojangs, isLoading, refreshDojang }}>
      {children}
    </DojangContext.Provider>
  );
};
