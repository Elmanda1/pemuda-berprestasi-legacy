import React, { useEffect } from 'react';
import { useKompetisi } from '../context/KompetisiContext';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

import { useRef } from 'react';
import { apiClient } from '../config/api';

/**
 * ThemeInjector
 * Menginjeksikan CSS Variables ke :root berdasarkan kompetisi yang aktif
 */
const ThemeInjector: React.FC = () => {
    const { kompetisiDetail, fetchKompetisiById, fetchKompetisiBySlug } = useKompetisi();
    const { user } = useAuth();
    const { idKompetisi, slug } = useParams<{ idKompetisi?: string, slug?: string }>();
    const location = useLocation();
    const hasAutoSelected = useRef(false);

    useEffect(() => {
        let targetId: number | null = null;
        const searchParams = new URLSearchParams(location.search);
        const queryId = searchParams.get('id_kompetisi');

        // priority 1: Slug from URL
        if (slug) {
            if (!kompetisiDetail || kompetisiDetail.slug !== slug) {
                fetchKompetisiBySlug(slug);
            }
            return;
        }

        // priority 2: ID parameter (Route Param OR Query Param)
        if (idKompetisi) {
            targetId = parseInt(idKompetisi);
        } else if (queryId) {
            targetId = parseInt(queryId);
        }
        // priority 3: Admin Kompetisi user
        else if (user?.role === "ADMIN_KOMPETISI" && user.admin_kompetisi?.id_kompetisi) {
            targetId = user.admin_kompetisi.id_kompetisi;
        }
        // priority 4: Local storage fallback for general admin or persistent view
        else {
            const storedId = localStorage.getItem('currentKompetisiId');
            if (storedId) targetId = parseInt(storedId);
        }

        if (targetId && (!kompetisiDetail || kompetisiDetail.id_kompetisi !== targetId)) {
            fetchKompetisiById(targetId).catch(() => {
                // If this specific fetch fails and it was from storage, clear it
                if (targetId === parseInt(localStorage.getItem('currentKompetisiId') || '0')) {
                    localStorage.removeItem('currentKompetisiId');
                }
            });
        }
    }, [idKompetisi, slug, user, location.pathname, location.search]);

    // Cleanup invalid storage if error occurs in context globally
    const { errorKompetisi } = useKompetisi();
    useEffect(() => {
        if (errorKompetisi) {
            const storedId = localStorage.getItem('currentKompetisiId');
            if (storedId) {
                // We don't know for sure if the error was for this ID, but if there's an error
                // and we have a stored ID potentially causing it, safest to clear it to prevent loops.
                // Especially if message indicates 404 or Not Found.
                if (errorKompetisi.includes('404') || errorKompetisi.includes('Not found')) {
                    localStorage.removeItem('currentKompetisiId');
                }
            }
        }
    }, [errorKompetisi]);

    // Enforce Organizer Scope & Aggressive Fix
    useEffect(() => {
        const checkAndFixMismatch = async () => {
            if (user?.role === 'ADMIN_PENYELENGGARA' && user.admin_penyelenggara && kompetisiDetail) {
                const detail = kompetisiDetail as any;
                const kompOrgId = detail.id_penyelenggara || detail.penyelenggara?.id_penyelenggara;

                if (kompOrgId && kompOrgId !== user.admin_penyelenggara.id_penyelenggara) {
                    console.warn("ThemeInjector: Mismatch organizer. Force fixing...");
                    localStorage.removeItem('currentKompetisiId');

                    try {
                        // Immediately try to find the correct one
                        const res: any = await apiClient.get(`/kompetisi?id_penyelenggara=${user.admin_penyelenggara.id_penyelenggara}&limit=1`);
                        const data = Array.isArray(res) ? res : (res.data || []);
                        const comps = Array.isArray(data) ? data : (data.data || []);

                        if (comps.length > 0) {
                            const myComp = comps[0];
                            const myCompId = myComp.id_kompetisi;
                            const myCompSlug = myComp.slug;

                            console.log("ThemeInjector: Fixed mismatch, switching to", myCompId);
                            localStorage.setItem('currentKompetisiId', myCompId.toString());

                            // If we're on a slug URL, redirect to the correct slug
                            if (slug && myCompSlug && slug !== myCompSlug) {
                                console.log(`ThemeInjector: Redirecting from /${slug} to /${myCompSlug}`);
                                const currentPath = location.pathname;
                                const newPath = currentPath.replace(`/${slug}`, `/${myCompSlug}`);
                                window.location.href = newPath;
                                return; // Stop execution, redirect will reload page
                            }

                            // Force update context
                            fetchKompetisiById(myCompId);
                            // Mark as selected to prevent other loops
                            hasAutoSelected.current = true;
                        } else {
                            console.warn("ThemeInjector: No competitions found for this organizer to switch to.");
                        }
                    } catch (err) {
                        console.error("ThemeInjector: Failed to fix mismatch", err);
                    }
                }
            }
        };

        checkAndFixMismatch();
    }, [user, kompetisiDetail, slug, location.pathname]);



    // Auto-select competition for Organizer Admin if none selected (Landing Page fix)
    useEffect(() => {
        const autoSelectCompetition = async () => {
            if (
                !slug &&
                !idKompetisi &&
                user?.role === 'ADMIN_PENYELENGGARA' &&
                user.admin_penyelenggara &&
                !kompetisiDetail &&
                !localStorage.getItem('currentKompetisiId') &&
                !hasAutoSelected.current
            ) {
                hasAutoSelected.current = true; // Prevent loop
                try {
                    console.log("ThemeInjector: Auto-selecting competition for organizer...");
                    const res: any = await apiClient.get(`/kompetisi?id_penyelenggara=${user.admin_penyelenggara.id_penyelenggara}&limit=1`);
                    const data = Array.isArray(res) ? res : (res.data || []);
                    // API might return pagination object if I didn't handle it in PHP well potentially, check structure
                    // In Controller: paginate(limit) returns LengthAwarePaginator.
                    // So res comes as { current_page: ..., data: [...] } if standard Laravel paginate.
                    // But my apiClient interceptor might sanitize it?
                    // Let's assume standard structure or array.
                    const comps = Array.isArray(data) ? data : (data.data || []);

                    if (comps.length > 0) {
                        const myCompId = comps[0].id_kompetisi;
                        console.log("ThemeInjector: Found competition", myCompId);
                        localStorage.setItem('currentKompetisiId', myCompId.toString());
                        fetchKompetisiById(myCompId);
                    } else {
                        console.log("ThemeInjector: No competitions found for this organizer.");
                    }
                } catch (err) {
                    console.error("ThemeInjector: Failed to auto-select competition", err);
                }
            }
        };

        autoSelectCompetition();
    }, [user, kompetisiDetail, slug, idKompetisi]);

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
