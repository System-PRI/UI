import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Member } from 'src/app/modules/user/models/member.model';
import { Student } from 'src/app/modules/user/models/student.model';

enum ROLE {
  FRONTEND = 'front-end',
  BACKEND = 'back-end',
  FULLSTACK = 'full-stack',
  SUPERVISOR = 'supervisor',
}

@Component({
  selector: 'project-members-table',
  templateUrl: './project-members-table.component.html',
  styleUrls: ['./project-members-table.component.scss']
})
export class ProjectMembersTableComponent implements OnChanges {
  @Input() members!: Member[];
  dataSource!: MatTableDataSource<Member>;
  columns = ['name', 'email', 'role', 'status'];

  getRole(role: keyof typeof ROLE): string {
    return ROLE[role]
  }
  
  isProjectAdmin(member: Member){
    return  member.admin;
  }

  isSupervisor(member: Member){
    return  member.role === 'SUPERVISOR'
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource<Member>(this.members);
  }
}
