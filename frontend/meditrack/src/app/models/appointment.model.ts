export interface Appointment {
    id?: number;
    doctorId: number;
    appointmentDateTime: Date;
    reason?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

export interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
}
