import { Component, Input, OnDestroy, OnChanges, HostListener } from '@angular/core';
import { DefenseScheduleService } from '../../defense-schedule.service';
import {  SupervisorDefenseAssignment } from '../../models/defense-schedule.model';
import { Subject, takeUntil} from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

interface SupervisorTimeReference {
  supervisor: string,
  time: string
}

@Component({
  selector: 'defense-committee-selection',
  templateUrl: './defense-committee-selection.component.html',
  styleUrls: ['./defense-committee-selection.component.scss']
})
export class DefenseCommittySelectionComponent implements OnChanges, OnDestroy {
  surnames: string[] = [];
  supervisors: string[] = [];
  times: string[] = [];
  hoveredSlots: {[key: string]: {[key: string]: boolean}} = {};
  lastSelectedSlots: {[key: string]: {[key: string]: SupervisorDefenseAssignment}} = {};
  startStatus!: boolean;
  lastSelectionStart: SupervisorTimeReference = { supervisor: '', time: '' }
  lastSelectionEnd: SupervisorTimeReference = { supervisor: '', time: '' }
  start: SupervisorTimeReference = { supervisor: '', time: '' }
  end: SupervisorTimeReference = { supervisor: '', time: '' }
  over: SupervisorTimeReference = { supervisor: '', time: '' }
  unsubscribe$ = new Subject();
  selectedSlots!: {[key: string]: { [key: string]: SupervisorDefenseAssignment }}
  comitteeMultipleSelection: string | null = null;
  roleMultipleSelection: string | null = 'member';
  classMultitpleSelection: string | null = null;
  @Input() assignment!: {[key: string]: { [key: string]: SupervisorDefenseAssignment }};
  slotsSelected: boolean = false;

  cursorPositionY = '';
  cursorPositionX = '';
  constructor(private defenseScheduleService: DefenseScheduleService){}

  ngOnChanges(): void {
    this.selectedSlots = this.assignment;
    for(let supervisor of Object.keys(this.selectedSlots)){
      this.hoveredSlots[supervisor] = {};
      this.lastSelectedSlots[supervisor] = {};
      this.supervisors.push(supervisor);

      for(let time of Object.keys(this.selectedSlots[supervisor])){
        if(this.times.indexOf(time) === -1){
          this.times.push(time);
        }
        this.hoveredSlots[supervisor][time] = false;
      }
    }
  }

  multipleClassSelectionChanged(){
    const supervisor = this.lastSelectionStart.supervisor;
    for(let t of Object.keys(this.selectedSlots[supervisor])){
      const startIndex = this.times.indexOf(this.lastSelectionStart.time);
      const endIndex = this.times.indexOf(this.lastSelectionEnd.time);

      for(let x=startIndex; x <= endIndex; x++){
        const time = this.times[x];
        this.selectedSlots[supervisor][time].classroom = this.classMultitpleSelection;
      }
    }
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
        if(event.value === 'chairperson'){
          this.selectedSlots[supervisor][time].chairperson = true;
        } else {
          this.selectedSlots[supervisor][time].classroom = null;
          this.classMultitpleSelection = null;
        }
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
        this.selectedSlots[supervisor][time].classroom = null;
      }
    }

    for(let supervisor of Object.keys(this.selectedSlots)){
      this.lastSelectedSlots[supervisor] = {};
    }

    this.slotsSelected = false;
  }

  closeSelectionMenu(){
    for(let supervisor of Object.keys(this.selectedSlots)){
      this.lastSelectedSlots[supervisor] = {};
    }
    this.slotsSelected = false;
  }

  onMouseDown(supervisor: string, time: string){
    for(let supervisor of Object.keys(this.selectedSlots)){
      this.lastSelectedSlots[supervisor] = {};
    }
    this.slotsSelected = false;
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

  onMouseUp(supervisor: string, time: string, event: MouseEvent){
    this.end = {supervisor, time};
    const startIndex = this.times.indexOf(this.start.time);
    const endIndex = this.times.indexOf(this.end.time);

    let target = event.target as HTMLElement;
    while(target.tagName !== 'TD'){
      target = target.parentElement!;
    }
    let rect = target.getBoundingClientRect();
    let windowScrollY = document.getElementsByTagName('mat-sidenav-content')[0].scrollTop;


    this.cursorPositionX = `${rect.x + rect.width}px`;
    this.cursorPositionY = `${rect.y + windowScrollY - 27}px`;


    if(this.end.supervisor === this.start.supervisor){

      this.slotsSelected = true;
      
      if(startIndex === endIndex){
        if(!this.selectedSlots[supervisor][time].committeeIdentifier){
          this.selectedSlots[supervisor][time].committeeIdentifier = 'A' 
        }
        this.lastSelectedSlots[supervisor][time] = JSON.parse(JSON.stringify(this.selectedSlots[supervisor][time]))
      } else {
        for(let t of Object.keys(this.selectedSlots[supervisor])){
          const timeIndex = this.times.indexOf(t);

          if(startIndex < endIndex){
            if((timeIndex >= startIndex && timeIndex <= endIndex)){
              if(!this.selectedSlots[supervisor][t].committeeIdentifier){
                this.selectedSlots[supervisor][t].committeeIdentifier = 'A'
              }
              this.lastSelectedSlots[supervisor][t] = JSON.parse(JSON.stringify(this.selectedSlots[supervisor][t]))
            }
          } else {
            if((timeIndex <= startIndex && timeIndex >= endIndex)){
              if(!this.selectedSlots[supervisor][t].committeeIdentifier){
                this.selectedSlots[supervisor][t].committeeIdentifier = 'A'
              }
              this.lastSelectedSlots[supervisor][t] = JSON.parse(JSON.stringify(this.selectedSlots[supervisor][t]))
            }
          }
        }
      }
      
      let countSameComittee = 0;
      let countSameRole = 0;
      let countSameClass = 0;
      for(let t of Object.keys(this.lastSelectedSlots[supervisor])){
        if(this.lastSelectedSlots[supervisor][t].committeeIdentifier === this.selectedSlots[supervisor][this.start.time].committeeIdentifier){
          countSameComittee++;
        }
        if(this.lastSelectedSlots[supervisor][t].chairperson === this.selectedSlots[supervisor][this.start.time].chairperson){
          countSameRole++;
        }
        if(this.lastSelectedSlots[supervisor][t].classroom === this.selectedSlots[supervisor][this.start.time].classroom){
          countSameClass++;
        }
      }

      if(countSameComittee === Object.keys(this.lastSelectedSlots[supervisor]).length){
        this.comitteeMultipleSelection = this.selectedSlots[supervisor][this.start.time].committeeIdentifier;
      } else {
        this.comitteeMultipleSelection = null;
      }

      if(countSameClass === Object.keys(this.lastSelectedSlots[supervisor]).length){
        this.classMultitpleSelection = this.selectedSlots[supervisor][this.start.time].classroom;
      } else {
        this.classMultitpleSelection = null;
      }

      if(countSameRole === Object.keys(this.lastSelectedSlots[supervisor]).length){
        this.roleMultipleSelection = this.selectedSlots[supervisor][this.start.time].chairperson ? 'chairperson' : 'member';
      } else {
        this.roleMultipleSelection = null;
      }

      console.log(this.lastSelectedSlots[supervisor])


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


    this.start = { supervisor: '', time: '' };
    this.end = { supervisor: '', time: '' };

    //console.log(this.selectedSlots)



  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }



}
