export interface ExampleType {
    id: number;
    name: string;
    isActive: boolean;
}

export interface User {
    id: string;
    username: string;
    email: string;
}

export type ApiResponse<T> = {
    data: T;
    error?: string;
};