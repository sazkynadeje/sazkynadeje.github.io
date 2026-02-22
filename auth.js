import { sanitizeId } from './core.js';

export const AuthService = {
    // Načte uložený profil z prohlížeče
    getUser: () => {
        const saved = localStorage.getItem('sazkovka_user');
        return saved ? JSON.parse(saved) : null;
    },

    // Uloží nový profil (při první návštěvě)
    setUser: (name, id = null) => {
        const userId = id || `${sanitizeId(name)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const user = { name: name.trim(), id: userId };
        localStorage.setItem('sazkovka_user', JSON.stringify(user));
        return user;
    },

    logout: () => {
        localStorage.removeItem('sazkovka_user');
        window.location.reload();
    }
};
