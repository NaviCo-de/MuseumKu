export interface UserProfile {
    uid: string;
    email: string;
    username: string;
    photoProfile: string | null;
    xp: number;
    createdAt: string;
    password: string;
}