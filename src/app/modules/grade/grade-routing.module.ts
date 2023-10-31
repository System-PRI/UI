import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GradeComponent } from './grade.component';
import { GradeDetailsComponent } from './components/grade-details/grade-details.component';
import { gradeDetailsResolver } from './resolvers/grade-details.resolver';
import { userResolver } from '../user/resolvers/user.resolver';

const routes: Routes = [
  { path: '', component: GradeComponent },
  { 
    path: 'details/:id', component: GradeDetailsComponent, 
    resolve: {
      gradeDetails: gradeDetailsResolver,
      user: userResolver
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradeRoutingModule { }
