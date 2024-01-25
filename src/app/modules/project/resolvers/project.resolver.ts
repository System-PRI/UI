import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ProjectService } from "../project.service";
import { ProjectDetails } from "../models/project.model";
import { map } from "rxjs";

export const projectResolver: ResolveFn<ProjectDetails> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(ProjectService).getProjectDetails(route.paramMap.get('id')!).pipe(
        map(projectDetails => {
          return {
            ...projectDetails,
            members:  [
              {
                indexNumber: projectDetails.supervisor.indexNumber,
                name: projectDetails.supervisor.name,
                email: projectDetails.supervisor.email,
                role: 'SUPERVISOR',
                accepted:  projectDetails?.accepted,
                admin: false
              },
              ...projectDetails?.students.map(student => {
                return {
                    indexNumber: student.indexNumber,
                    name: student.name,
                    email: student.email,
                    role: student.role!,
                    accepted: student.accepted!,
                    admin: student.indexNumber === projectDetails.admin
                  }
              })
            ]
          }
        })
      );
};
