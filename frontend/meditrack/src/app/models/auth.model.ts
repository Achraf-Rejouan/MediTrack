export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    phone: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    role: string;
}
