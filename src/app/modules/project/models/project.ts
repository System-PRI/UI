import { Student } from "./student";
import { Supervisor } from "./supervisor";

export interface Project {
    id?: string;
    name: string;
    supervisor: string,
    acceptanceStatus: boolean;
}

export interface ProjectDetails {
    id: string;
    name: string;
    description: string;
    members: Student[];
    admin: string;
    technologies: string[];
    supervisor: Supervisor;
}