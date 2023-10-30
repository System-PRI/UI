import { Supervisor } from "../../user/models/supervisor.model";

export interface Grade {
    id?: number;
    projectName: string;
    supervisor: Supervisor,
    grade: string;
    criteriaMet: boolean;
}

export interface GradeFilters {
    searchValue: string;
    supervisorIndexNumber: string | undefined;
    criteriaMetStatus: boolean | undefined;
    columns: string[];
}
