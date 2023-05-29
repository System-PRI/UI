import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectShellComponent } from './components/project-shell/project-shell.component';

const routes: Routes = [
  { path: '', component: ProjectShellComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
