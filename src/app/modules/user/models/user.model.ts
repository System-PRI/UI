export interface User {
    indexNumber: string;
    name: string;
    role: "STUDENT" | "SUPERVISOR" | "COORDINATOR" | "PROJECT_ADMIN";
    studyYears: string[];
    projects: string[];
    acceptedProjects: string[];
}