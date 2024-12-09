export interface User {
    uid: string,
    email: string,
    password: string,
    status: 'Pendente' | 'Aprovado',
    role: string | null,
    createdAt: Date
}