export interface Supervisor {
    id: string,
    email: string;
    name: string,
    indexNumber: string;
}

export interface SupervisorAvailability {
    name: string,
    taken: number,
    availability: number,
}
