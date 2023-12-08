import { Component, Input, OnDestroy, OnChanges } from '@angular/core';
import { DefenseScheduleService } from '../../defense-schedule.service';
import {  SupervisorDefenseAssignment } from '../../models/defense-schedule.model';
import { Subject, takeUntil} from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

interface SupervisorTimeReference {
  supervisor: string,
  time: string
}

@Component({
  selector: 'defense-committy-selection',
  templateUrl: './defense-committy-selection.component.html',
  styleUrls: ['./defense-committy-selection.component.scss']
})
export class DefenseCommittySelectionComponent implements OnChanges, OnDestroy {
  surnames: string[] = [];
  supervisors: string[] = [];
  times: string[] = [];
  hoveredSlots: {[key: string]: {[key: string]: boolean}} = {};
  startStatus!: boolean;
  lastSelectionStart: SupervisorTimeReference = { supervisor: '', time: '' }
  lastSelectionEnd: SupervisorTimeReference = { supervisor: '', time: '' }
  start: SupervisorTimeReference = { supervisor: '', time: '' }
  end: SupervisorTimeReference = { supervisor: '', time: '' }
  over: SupervisorTimeReference = { supervisor: '', time: '' }
  unsubscribe$ = new Subject();
  selectedSlots!: {[key: string]: { [key: string]: SupervisorDefenseAssignment }}
  comitteeMultipleSelection: string | null = null;
  roleMultipleSelection: string | null = 'member'
  @Input() assignment!: {[key: string]: { [key: string]: SupervisorDefenseAssignment }};

  constructor(private defenseScheduleService: DefenseScheduleService){}

  ngOnChanges(): void {
    this.selectedSlots = this.assignment;
    console.log(this.selectedSlots)

    for(let supervisor of Object.keys(this.selectedSlots)){
      this.hoveredSlots[supervisor] = {};
      this.supervisors.push(supervisor);

      for(let time of Object.keys(this.selectedSlots[supervisor])){
        if(this.times.indexOf(time) === -1){
          this.times.push(time);
        }
        this.hoveredSlots[supervisor][time] = false;
      }
    }
  }

  
  committyChanged(event: MatSelectChange){
   
  }

  multipleCommitteeSelectionChanged(event: MatSelectChange){
    const supervisor = this.lastSelectionStart.supervisor;
    for(let t of Object.keys(this.selectedSlots[supervisor])){
      const startIndex = this.times.indexOf(this.lastSelectionStart.time);
      const endIndex = this.times.indexOf(this.lastSelectionEnd.time);

      for(let x=startIndex; x <= endIndex; x++){
        const time = this.times[x];
        this.selectedSlots[supervisor][time].committeeIdentifier = event.value;
      }
    }
  }

  multipleRoleSelectionChanged(event: MatSelectChange){
    const supervisor = this.lastSelectionStart.supervisor;
    for(let t of Object.keys(this.selectedSlots[supervisor])){
      const startIndex = this.times.indexOf(this.lastSelectionStart.time);
      const endIndex = this.times.indexOf(this.lastSelectionEnd.time);

      for(let x=startIndex; x <= endIndex; x++){
        const time = this.times[x];
        this.selectedSlots[supervisor][time].chairperson = event.value === 'chairperson'
      }
    }
  }

  unselectSlots(){
    const supervisor = this.lastSelectionStart.supervisor;
    for(let t of Object.keys(this.selectedSlots[supervisor])){
      const startIndex = this.times.indexOf(this.lastSelectionStart.time);
      const endIndex = this.times.indexOf(this.lastSelectionEnd.time);

      for(let x=startIndex; x <= endIndex; x++){
        const time = this.times[x];
        this.selectedSlots[supervisor][time].committeeIdentifier = null
        this.selectedSlots[supervisor][time].chairperson = false;
      }
    }
  }

  onMouseDown(supervisor: string, time: string){
    this.hoveredSlots[supervisor][time] = true;
    this.start = {supervisor, time}
    this.startStatus = this.selectedSlots[this.start.supervisor][this.start.time].committeeIdentifier !== null
  }

  onMouseEnter(supervisor: string, time: string){
    if(this.start.supervisor === supervisor){
      if(this.start.time !== time){
        this.hoveredSlots[supervisor][time] = true;
      }
      this.over = {supervisor, time};
  
      const startIndex = this.times.indexOf(this.start.time);
      const overIndex = this.times.indexOf(this.over.time);
  
      for(let t of Object.keys(this.hoveredSlots[supervisor])){
        const timeIndex = this.times.indexOf(t);
  
        if(this.start.supervisor === supervisor && 
          (timeIndex > startIndex && timeIndex > overIndex)){
          this.hoveredSlots[supervisor][t] = false;
        }
      }
  
    } else {
      this.start = { supervisor: '', time: '' };
      this.end = { supervisor: '', time: '' };
      this.supervisors.forEach(supervisor => {
        this.hoveredSlots[supervisor] = {};
  
        this.times.forEach(time => {
          this.hoveredSlots[supervisor][time] = false;
        })
      });
    }

    
  }

  onMouseUp(supervisor: string, time: string){
    this.end = {supervisor, time};
    const startIndex = this.times.indexOf(this.start.time);
    const endIndex = this.times.indexOf(this.end.time);

    if(this.end.supervisor === this.start.supervisor){
      
      if(startIndex === endIndex){
        if(!this.selectedSlots[supervisor][time].committeeIdentifier){
          this.selectedSlots[supervisor][time].committeeIdentifier = 'A' 
        }
      } else {
        for(let t of Object.keys(this.selectedSlots[supervisor])){
          const timeIndex = this.times.indexOf(t);

          if(startIndex < endIndex){
            if((timeIndex >= startIndex && timeIndex <= endIndex)){
              if(!this.selectedSlots[supervisor][t].committeeIdentifier){
                this.selectedSlots[supervisor][t].committeeIdentifier = 'A'
              }
            }
          } else {
            if((timeIndex <= startIndex && timeIndex >= endIndex)){
              if(!this.selectedSlots[supervisor][t].committeeIdentifier){
                this.selectedSlots[supervisor][t].committeeIdentifier = 'A'
              }
            }
          }

         
         
        }
      }
    }

    this.supervisors.forEach(supervisor => {
      this.hoveredSlots[supervisor] = {};

      this.times.forEach(time => {
        this.hoveredSlots[supervisor][time] = false;
      })
    });

    if(startIndex < endIndex){
        this.lastSelectionStart = this.start;
        this.lastSelectionEnd = this.end;
    } else {
        this.lastSelectionEnd = this.start;
        this.lastSelectionStart = this.end;
    }

    this.comitteeMultipleSelection = null; 
    this.roleMultipleSelection = null; 
    this.start = { supervisor: '', time: '' };
    this.end = { supervisor: '', time: '' };

    console.log(this.selectedSlots)

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }



}
