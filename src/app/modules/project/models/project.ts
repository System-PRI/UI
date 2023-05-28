import { ExternalLink } from "../../external-link/models/external-link.model";
import { Student } from "../../user/models/student.model";
import { Supervisor } from "../../user/models/supervisor.model";

export interface Project {
    id?: string;
    name: string;
    supervisor: Supervisor,
    accepted: boolean;
}

export interface ProjectDetails {
    id?: string;
    name: string;
    description: string
    students: Student[];
    admin: string;
    technologies: string[];
    supervisor: Supervisor;
    accepted: boolean;
    externalLinks?: ExternalLink[]
}
