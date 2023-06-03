import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

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

  constructor(private http: HttpClient) {}

  uploadStudents(event: any) {
      const file: File = event.target.files[0];
      if (file) {
          this.studentsFileName= file.name;
          this.studentsFile = new FormData();
          this.studentsFile.append("students", file);
          this.http.post(`/apigateway/data/import/student`, this.studentsFile)
      }
  }
  
  uploadSupervisors(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        this.supervisorsFileName = file.name;
        this.supervisorsFile = new FormData();
        this.supervisorsFile.append("supervisors", file);
        this.http.post("/apigateway/data/import/student", this.supervisorsFile);
    }
  }

  uploadFiles(){
    
  }
}
