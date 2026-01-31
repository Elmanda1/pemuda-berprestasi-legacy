import React, { useEffect } from 'react';
import { useKompetisi } from '../context/KompetisiContext';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

/**
 * ThemeInjector
 * Menginjeksikan CSS Variables ke :root berdasarkan kompetisi yang aktif
 */
const ThemeInjector: React.FC = () => {
    const { kompetisiDetail, fetchKompetisiById } = useKompetisi();
    const { user } = useAuth();
    const { idKompetisi } = useParams<{ idKompetisi: string }>();
    const location = useLocation();

    useEffect(() => {
        let targetId: number | null = null;

        // priority 1: URL parameter
        if (idKompetisi) {
            targetId = parseInt(idKompetisi);
        }
        // priority 2: Admin Kompetisi user
        else if (user?.role === "ADMIN_KOMPETISI" && user.admin_kompetisi?.id_kompetisi) {
            targetId = user.admin_kompetisi.id_kompetisi;
        }
        // priority 3: Local storage fallback for general admin or persistent view
        else {
            const storedId = localStorage.getItem('currentKompetisiId');
            if (storedId) targetId = parseInt(storedId);
        }

        if (targetId && (!kompetisiDetail || kompetisiDetail.id_kompetisi !== targetId)) {
            fetchKompetisiById(targetId);
        }
    }, [idKompetisi, user, location.pathname]);

    useEffect(() => {
        const root = document.documentElement.style;

        if (kompetisiDetail?.primary_color) {
            root.setProperty('--color-primary', kompetisiDetail.primary_color);
        } else {
            root.setProperty('--color-primary', '#990D35');
        }

        if (kompetisiDetail?.secondary_color) {
            root.setProperty('--color-secondary', kompetisiDetail.secondary_color);
        } else {
            root.setProperty('--color-secondary', '#F5B700'); // Default Yellow
        }
    }, [kompetisiDetail]);

    return null; // Component ini tidak me-render apa-apa
};

export default ThemeInjector;
