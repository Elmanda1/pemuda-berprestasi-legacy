import React, { useEffect, useState } from "react";
import { Loader, Radio, User } from "lucide-react";
import { useKompetisi } from "../context/KompetisiContext";

interface KelasLapangan {
  id_kelas_kejuaraan: number;
  nama_kelas: string;
  jumlah_peserta: number;
  status_antrian: "bertanding" | "persiapan" | "pemanasan" | "menunggu";
  nomor_antrian: number;
}

interface LapanganData {
  id_lapangan: number;
  nama_lapangan: string;
  tanggal: string;
  kelas_kejuaraan: KelasLapangan[];
  antrian: {
    bertanding: number;
    persiapan: number;
    pemanasan: number;
  } | null;
}

interface HariData {
  tanggal: string;
  lapangan: LapanganData[];
}

interface MatchData {
  nomor_antrian: number;
  nomor_lapangan: string;
  nama_atlet_a: string;
  nama_dojang_a?: string;
  nama_atlet_b: string;
  nama_dojang_b?: string;
  foto_atlet_a?: string;
  foto_atlet_b?: string;
  stage_name?: string;
}

const getPhotoUrl = (filename: string): string | null => {
  if (!filename) return null;
  return `${process.env.REACT_APP_API_BASE_URL || "http://cjvmanagementevent.com"
    }/uploads/atlet/pas_foto/${filename}`;
};

const LivePertandinganView: React.FC<{ idKompetisi?: number }> = ({
  idKompetisi,
}) => {
  const { kompetisiDetail } = useKompetisi();
  const [hariList, setHariList] = useState<HariData[]>([]);
  const [matchData, setMatchData] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedHari, setSelectedHari] = useState<string | null>(null);

  const templateType = kompetisiDetail?.template_type || 'default';
  const isModern = templateType === 'modern' || templateType === 'template_b';

  const theme = {
    bg: isModern ? "bg-[#0a0a0a]" : "bg-[#F5FBEF]",
    textTitle: isModern ? "from-white via-gray-200 to-gray-400" : "from-red via-red/90 to-red/80",
    textBody: isModern ? "text-gray-400" : "text-[#050505]",
    cardBg: isModern ? "bg-[#111] border-gray-800" : "bg-white/90 border-red/10",
    accentColor: isModern ? "text-red-500" : "text-[#990D35]",
    borderColor: isModern ? "border-gray-800" : "border-[#990D35]",
    buttonActive: isModern ? "bg-red-600 text-white border-red-600" : "bg-[#990D35] text-[#F5FBEF] border-[#990D35]",
    buttonInactive: isModern ? "bg-black text-red-500 border-red-600" : "bg-white text-[#990D35] border-[#990D35]",
    matchCardBg: isModern ? "bg-[#111] border-gray-700" : "bg-[#F9FAFB] border-[#E5E7EB]",
    matchText: isModern ? "text-white" : "text-black",
    secondaryText: isModern ? "text-gray-500" : "text-black/60",
    vsText: isModern ? "text-gray-400" : "text-black",
    dayButtonBorder: isModern ? "border-red-600/30" : "border-[#990D35]/20",
    dayButtonHover: isModern ? "hover:border-red-600" : "hover:border-[#990D35]",
    emptyStateText: isModern ? "text-gray-500" : "text-[#050505]",
  };

  // Mapping for status colors to avoid JIT/Purge CSS issues with dynamic classes
  // Enhanced for dark mode visibility
  const statusColors = {
    Bertanding: {
      text: isModern ? "text-green-400" : "text-green-700",
      bg: isModern ? "bg-green-900/20 border border-green-800/50" : "bg-green-100"
    },
    Persiapan: {
      text: isModern ? "text-orange-400" : "text-orange-700",
      bg: isModern ? "bg-orange-900/20 border border-orange-800/50" : "bg-orange-100"
    },
    Pemanasan: {
      text: isModern ? "text-yellow-400" : "text-yellow-700",
      bg: isModern ? "bg-yellow-900/20 border border-yellow-800/50" : "bg-yellow-100"
    },
  };

  const generateNamaKelas = (kelas: any) => {
    const parts = [];
    if (kelas.cabang) parts.push(kelas.cabang);
    if (kelas.kategori_event?.nama_kategori)
      parts.push(kelas.kategori_event.nama_kategori);

    const isPoomsaePemula =
      kelas.cabang === "POOMSAE" &&
      kelas.kategori_event?.nama_kategori === "Pemula";
    if (kelas.kelompok?.nama_kelompok && !isPoomsaePemula) {
      parts.push(kelas.kelompok.nama_kelompok);
    }

    if (kelas.kelas_berat) {
      const gender =
        kelas.kelas_berat.jenis_kelamin === "LAKI_LAKI" ? "Putra" : "Putri";
      parts.push(gender);
    }

    if (kelas.kelas_berat?.nama_kelas) parts.push(kelas.kelas_berat.nama_kelas);
    if (kelas.poomsae?.nama_kelas) parts.push(kelas.poomsae.nama_kelas);

    return parts.length > 0 ? parts.join(" - ") : "Kelas Tidak Lengkap";
  };

  useEffect(() => {
    if (!idKompetisi) return;
    fetchLiveData();

    const interval = setInterval(() => {
      fetchLiveData();
      // ⭐ Force refresh match data setiap interval
      if (selectedHari && hariList.length > 0) {
        const selectedDayIndex = hariList.findIndex(
          (hari) => hari.tanggal === selectedHari
        );
        const selectedDayNumber =
          selectedDayIndex >= 0 ? selectedDayIndex + 1 : undefined;
        if (selectedDayNumber !== undefined) {
          fetchMatchData(selectedDayNumber, true);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [idKompetisi, selectedHari, hariList]);

  // NEW useEffect for fetching match data based on selectedHari
  useEffect(() => {
    if (idKompetisi && selectedHari && hariList.length > 0) {
      const selectedDayIndex = hariList.findIndex(
        (hari) => hari.tanggal === selectedHari
      );
      const selectedDayNumber =
        selectedDayIndex >= 0 ? selectedDayIndex + 1 : undefined;

      if (selectedDayNumber !== undefined) {
        fetchMatchData(selectedDayNumber, true); // ⭐ Force refresh on mount
      }
    }
  }, [idKompetisi, selectedHari, hariList]);

  const fetchLiveData = async () => {
    if (!idKompetisi) return;

    try {
      const res = await fetch(`/api/v1/lapangan/kompetisi/${idKompetisi}`);
      const data = await res.json();

      if (data.success) {
        const hariData = data.data.hari_pertandingan.map((hari: any) => ({
          tanggal: hari.tanggal,
          lapangan: hari.lapangan.map((lap: any) => ({
            id_lapangan: lap.id_lapangan,
            nama_lapangan: lap.nama_lapangan,
            tanggal: lap.tanggal,
            antrian: lap.antrian,
            kelas_kejuaraan: (lap.kelas_list || []).map(
              (kelasItem: any, index: number) => ({
                id_kelas_kejuaraan: kelasItem.id_kelas_kejuaraan,
                nama_kelas: generateNamaKelas(kelasItem.kelas_kejuaraan),
                jumlah_peserta: 0,
                status_antrian:
                  index === 0
                    ? "bertanding"
                    : index === 1
                      ? "persiapan"
                      : index === 2
                        ? "pemanasan"
                        : "menunggu",
                nomor_antrian: index + 1,
              })
            ),
          })),
        }));

        setHariList(hariData);

        if (!selectedHari && hariData.length > 0) {
          // Default to the second day if available and hariData has at least two days
          const defaultDay =
            hariData.length > 1 ? hariData[1].tanggal : hariData[0].tanggal;
          setSelectedHari(defaultDay);
        }
      }
    } catch (err: any) {
      console.error("Error fetching live data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchData = async (hari?: number, forceRefresh = false) => {
    if (!idKompetisi) return;
    try {
      const timestamp = forceRefresh ? `&_t=${Date.now()}` : "";
      const url = hari
        ? `/api/v1/pertandingan/kompetisi/${idKompetisi}?hari=${hari}${timestamp}`
        : `/api/v1/pertandingan/kompetisi/${idKompetisi}${timestamp}`;

      console.log("🔍 Fetching match data from:", url);

      const res = await fetch(url, {
        cache: "no-cache", // ⭐ Prevent caching
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      const data = await res.json();

      console.log("📊 Match data received:", data);
      console.log(
        "📋 Lapangan A matches:",
        data.data?.filter((m) => m.nomor_lapangan === "A")
      );

      if (data.success) {
        setMatchData(data.data);
      }
    } catch (error) {
      console.error("Error fetching match data:", error);
    }
  };

  const currentHari = hariList.find((h) => h.tanggal === selectedHari);

  const renderMatchDetails = (
    lap: LapanganData,

    match: MatchData | undefined,

    title: string

    // colorClass: string // No longer needed directly for bgColor
  ) => {
    const { bg: bgColor, text: textColor } = statusColors[title];

    const matchNumber =
      title === "Bertanding"
        ? lap.antrian?.bertanding
        : title === "Persiapan"
          ? lap.antrian?.persiapan
          : lap.antrian?.pemanasan;

    const renderAtlet = (
      nama: string,
      dojang: string | undefined,
      foto: string | undefined
    ) => {
      const photoUrl = foto ? getPhotoUrl(foto) : null;

      return (
        <div className="flex flex-col items-center justify-center w-full">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={nama}
              className={`w-16 h-16 rounded-full object-cover mb-2 ${theme.borderColor} border-2`}
            />
          ) : (
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${isModern ? "bg-gray-800" : "bg-gray-200"}`}>
              <User className={`w-8 h-8 ${isModern ? "text-gray-500" : "text-gray-500"}`} />
            </div>
          )}

          <p className={`text-lg font-semibold text-center uppercase ${theme.matchText}`}>
            {nama || "Nama peserta tidak tersedia"}
          </p>
          {dojang && (
            <p className={`text-sm text-center mt-1 ${theme.secondaryText}`}>
              {dojang}
            </p>
          )}
        </div>
      );
    };

    return (
      <div className={`relative w-full ${textColor} ${bgColor} p-4 rounded-lg`}>
        <div className={`absolute top-2 left-2 rounded-xl w-16 h-16 flex items-center justify-center text-5xl font-bold ${isModern ? "bg-black/40 text-white" : "bg-[#FFF]"}`}>
          {matchNumber}
        </div>

        {match ? (
          <div className="flex flex-col gap-4 mt-8">
            {renderAtlet(match.nama_atlet_a, match.nama_dojang_a, match.foto_atlet_a)}

            <div className="flex items-center justify-center">
              <span className={`text-xl font-bold ${theme.vsText}`}>VS</span>
            </div>

            {renderAtlet(match.nama_atlet_b, match.nama_dojang_b, match.foto_atlet_b)}
          </div>
        ) : (
          <div className="text-center mt-8 text-lg font-medium">
            <p>Nama peserta tidak tersedia</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme.bg}`}
      >
        <div className="text-center">
          <Loader
            className={`animate-spin mx-auto mb-4 ${theme.accentColor}`}
            size={48}
          />
          <p className={`text-lg font-medium ${theme.accentColor}`}>
            Memuat data live...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
        <div
          className={`text-center p-8 rounded-xl border ${theme.cardBg} border-red-600`}
        >
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`relative w-full min-h-screen overflow-hidden py-12 md:py- pt-24 sm:pt-28 md:pt-32 lg:pt-36 ${theme.bg}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
          <div className="hidden lg:inline-block group">
            <span className={`font-plex font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] border-l-4 pl-3 sm:pl-4 md:pl-6 relative ${theme.accentColor} ${theme.borderColor}`}>
              antrean pertandingan
              <div className={`absolute -left-1 top-0 bottom-0 w-1 transition-colors duration-300 ${isModern ? "bg-red-500/20 group-hover:bg-red-500/40" : "bg-red/20 group-hover:bg-red/40"}`}></div>
            </span>
          </div>

          <div className="relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bebas leading-[0.85] tracking-wide">
              <span className={`bg-gradient-to-r ${theme.textTitle} bg-clip-text text-transparent`}>
                live Antrean
              </span>
            </h1>
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 rounded-full bg-gradient-to-r ${theme.textTitle}`}></div>
          </div>

          <p className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-plex max-w-4xl mx-auto leading-relaxed font-light px-2 sm:px-4 ${theme.secondaryText}`}>
            Pantau aktivitas setiap lapangan dari pemanasan hingga pertandingan
            berlangsung
          </p>
        </div>

        {hariList.length > 1 && (
          <div className="flex justify-center gap-2 my-8 overflow-x-auto pb-2">
            {hariList.map((hari, idx) => (
              <button
                key={hari.tanggal}
                onClick={() => setSelectedHari(hari.tanggal)}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all border-2 ${selectedHari === hari.tanggal
                  ? `${theme.buttonActive} shadow-lg`
                  : `${theme.buttonInactive} opacity-60 hover:opacity-100`
                  }`}
              >
                Hari ke-{idx + 1}
                <div className="text-xs opacity-80 mt-1">
                  {new Date(hari.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </button>
            ))}
          </div>
        )}

        {currentHari && currentHari.lapangan.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 w-full">
            {currentHari.lapangan.map((lap) => {
              const bertandingMatch = matchData.find(
                (m) =>
                  m.nomor_lapangan === lap.nama_lapangan &&
                  m.nomor_antrian === lap.antrian?.bertanding
              );
              const persiapanMatch = matchData.find(
                (m) =>
                  m.nomor_lapangan === lap.nama_lapangan &&
                  m.nomor_antrian === lap.antrian?.persiapan
              );
              const pemanasanMatch = matchData.find(
                (m) =>
                  m.nomor_lapangan === lap.nama_lapangan &&
                  m.nomor_antrian === lap.antrian?.pemanasan
              );

              return (
                <div
                  key={lap.id_lapangan}
                  className={`relative p-6 rounded-2xl shadow-xl border transition-all duration-500 hover:shadow-2xl w-full ${theme.cardBg}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3
                      className={`text-3xl font-bebas ${theme.accentColor}`}
                    >
                      Lapangan {lap.nama_lapangan}
                    </h3>
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  </div>

                  {lap.antrian && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-2xl font-semibold text-green-700 mb-2">
                          Bertanding
                        </h4>
                        {renderMatchDetails(lap, bertandingMatch, "Bertanding")}
                      </div>
                      <div>
                        <h4 className="text-2xl font-semibold text-orange-700 mb-2">
                          Persiapan
                        </h4>
                        {renderMatchDetails(lap, persiapanMatch, "Persiapan")}
                      </div>
                      <div>
                        <h4 className="text-2xl font-semibold text-yellow-700 mb-2">
                          Pemanasan
                        </h4>
                        {renderMatchDetails(lap, pemanasanMatch, "Pemanasan")}
                      </div>
                    </div>
                  )}
                  <p
                    className={`text-sm mt-6 text-center ${theme.secondaryText} opacity-60`}
                  >
                    {new Date(lap.tanggal).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p
              className={`text-lg font-medium ${theme.secondaryText} opacity-60`}
            >
              Belum ada data lapangan untuk hari ini
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LivePertandinganView;
