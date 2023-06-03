import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DataFeedService } from './data-feed.service';

@Component({
  selector: 'app-data-feed',
  templateUrl: './data-feed.component.html',
  styleUrls: ['./data-feed.component.scss']
})
export class DataFeedComponent {
  supervisorsFileName = '';
  supervisorsFile!: FormData;

  studentsFileName = '';
  studentsFile!: FormData;

  constructor(private http: HttpClient, private dataFeedService: DataFeedService) {}

  uploadStudents(event: any) {
      const file: File = event.target.files[0];
      if (file) {
          this.studentsFileName= file.name;
          this.studentsFile = new FormData();
          this.studentsFile.append("students", file);
      }
  }
  
  uploadSupervisors(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        this.supervisorsFileName = file.name;
        this.supervisorsFile = new FormData();
        this.supervisorsFile.append("supervisors", file);
    }
  }

  uploadFiles(){
    if(this.studentsFile){
      this.dataFeedService.uploadStudents(this.studentsFile).subscribe()
    }
    if(this.supervisorsFile){
      this.dataFeedService.uploadSupervisors(this.supervisorsFile).subscribe()
    }
  }
}
