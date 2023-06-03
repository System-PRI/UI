import { ExternalLink } from "../../external-link/models/external-link.model";
import { Student } from "../../user/models/student.model";
import { Supervisor } from "../../user/models/supervisor.model";
import { User } from "../../user/models/user.model";

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
    confirmed: boolean;
    externalLinks?: ExternalLink[]
}

export interface ProjectFilters {
    searchValue: string;
    supervisorIndexNumber: string | undefined;
    acceptanceStatus: boolean | undefined;
}

export interface ProjectFormData {
    supervisors: Supervisor[];
    students: Student[];
    user: User;
    projectDetails?: ProjectDetails;
}

export interface ProjectDetailsData {
    projectDetails?: ProjectDetails;
    user: User;
    columns: string[];
}
