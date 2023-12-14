import { Component, Input, OnDestroy, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { DefenseScheduleService } from '../../defense-schedule.service';
import {  SupervisorDefenseAssignment, SupervisorStatistics } from '../../models/defense-schedule.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil} from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';

interface SupervisorTimeReference {
  supervisor: string,
  time: string
}

@Component({
  selector: 'defense-committee-selection',
  templateUrl: './defense-committee-selection.component.html',
  styleUrls: ['./defense-committee-selection.component.scss']
})
export class DefenseCommitteeSelectionComponent implements OnChanges, OnDestroy, OnInit {
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
  committeeMultipleSelection: string | null = null;
  roleMultipleSelection: boolean = false;
  classMultitpleSelection = new FormControl<string | null>(null);
  @Input() assignment!: {[key: string]: { [key: string]: SupervisorDefenseAssignment }};
  @Output() updateStatistics: EventEmitter<SupervisorStatistics[]> = new EventEmitter();
  slotsSelected: boolean = false;

  committiesChairpersonAssignments: { [key:string]: any } = {
    'A': {
      chairpersonId: null,
      class: null
    },
    'B': {
      chairpersonId: null,
      class: null
    },
    'C': {
      chairpersonId: null,
      class: null
    },
    'D': {
      chairpersonId: null,
      class: null
    }
  }

  cursorPositionY = '';
  cursorPositionX = '';
  constructor(private defenseScheduleService: DefenseScheduleService){}

  ngOnInit(): void {
    this.classMultitpleSelection.valueChanges.pipe(takeUntil(this.unsubscribe$), distinctUntilChanged(),
    debounceTime(500)).subscribe(
      (newValue: string | null) => {
        let classroom = newValue;
        if(classroom === '') classroom = null;
        const supervisor = this.lastSelectionStart.supervisor;
        for(let t of Object.keys(this.lastSelectedSlots[supervisor])){
          this.lastSelectedSlots[supervisor][t].classroom = classroom;
          this.selectedSlots[supervisor][t].classroom = classroom;
        }

          if(this.roleMultipleSelection){
            this.updateCommitteeSchedule(this.lastSelectedSlots[supervisor])
          }         
        }
    )
  }

  ngOnChanges(): void {
    this.selectedSlots = this.assignment;
    if(this.selectedSlots){
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
  }

  updateCommitteeSchedule(slots: {[key: string]: SupervisorDefenseAssignment}){
    this.defenseScheduleService.updateCommitteeSchedule(slots).pipe(takeUntil(this.unsubscribe$)).subscribe(
      statistics => this.updateStatistics.emit(statistics)
    )
  }

 
  multipleCommitteeSelectionChanged(event: MatSelectChange){
    const supervisor = this.lastSelectionStart.supervisor;
    for(let t of Object.keys(this.lastSelectedSlots[supervisor])){
      this.lastSelectedSlots[supervisor][t].committeeIdentifier = event.value;
      this.selectedSlots[supervisor][t].committeeIdentifier = event.value;
    }
    this.updateCommitteeSchedule(this.lastSelectedSlots[supervisor])
    console.log('committee');


  }

  multipleRoleSelectionChanged(){
    const supervisor = this.lastSelectionStart.supervisor;
    for(let t of Object.keys(this.lastSelectedSlots[supervisor])){
        if(this.roleMultipleSelection){
          this.lastSelectedSlots[supervisor][t].chairperson = true;
          this.selectedSlots[supervisor][t].chairperson = true;
        } else {
          this.lastSelectedSlots[supervisor][t].chairperson = false;
          this.selectedSlots[supervisor][t].chairperson = false;
          this.lastSelectedSlots[supervisor][t].classroom = null;
          this.selectedSlots[supervisor][t].classroom = null;
          this.classMultitpleSelection.setValue(null);
        }
    }
    this.updateCommitteeSchedule(this.lastSelectedSlots[supervisor])
    console.log('role');


  }

  unselectSlots(){
    const supervisor = this.lastSelectionStart.supervisor;
    for(let t of Object.keys(this.selectedSlots[supervisor])){
      const startIndex = this.times.indexOf(this.lastSelectionStart.time);
      const endIndex = this.times.indexOf(this.lastSelectionEnd.time);

      for(let x=startIndex; x <= endIndex; x++){
        const time = this.times[x];
        this.lastSelectedSlots[supervisor][time].committeeIdentifier = null
        this.lastSelectedSlots[supervisor][time].chairperson = false;
        this.lastSelectedSlots[supervisor][time].classroom = null;
        this.selectedSlots[supervisor][time].committeeIdentifier = null
        this.selectedSlots[supervisor][time].chairperson = false;
        this.selectedSlots[supervisor][time].classroom = null;
      }
    }
    this.updateCommitteeSchedule(this.lastSelectedSlots[supervisor])

    for(let supervisor of Object.keys(this.selectedSlots)){
      this.lastSelectedSlots[supervisor] = {};
    }
    console.log('unselect');


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
    let matTabBodyRect = document.getElementsByClassName('mat-mdc-tab-body-active')[0].getBoundingClientRect();
    this.cursorPositionX = `${rect.x + rect.width - matTabBodyRect.x}px`;
    this.cursorPositionY = `${rect.y - matTabBodyRect.y}px`;
    let countAlreadySelectedSlots = 0;

    if(this.end.supervisor === this.start.supervisor){
      this.slotsSelected = true;
      
      if(startIndex === endIndex){
        if(!this.selectedSlots[supervisor][time].committeeIdentifier){
          this.selectedSlots[supervisor][time].committeeIdentifier = 'A';
        } else {
          countAlreadySelectedSlots++;
        }
        this.lastSelectedSlots[supervisor][time] = JSON.parse(JSON.stringify(this.selectedSlots[supervisor][time]))
      } else {
        for(let t of Object.keys(this.selectedSlots[supervisor])){
          const timeIndex = this.times.indexOf(t);

          if(startIndex < endIndex){
            if((timeIndex >= startIndex && timeIndex <= endIndex)){
              if(!this.selectedSlots[supervisor][t].committeeIdentifier){
                this.selectedSlots[supervisor][t].committeeIdentifier = 'A'
              } else {
                countAlreadySelectedSlots++;
              }
              this.lastSelectedSlots[supervisor][t] = JSON.parse(JSON.stringify(this.selectedSlots[supervisor][t]))
            }
          } else {
            if((timeIndex <= startIndex && timeIndex >= endIndex)){
              if(!this.selectedSlots[supervisor][t].committeeIdentifier){
                this.selectedSlots[supervisor][t].committeeIdentifier = 'A'
              } else {
                countAlreadySelectedSlots++;
              }
              this.lastSelectedSlots[supervisor][t] = JSON.parse(JSON.stringify(this.selectedSlots[supervisor][t]))
            }
          }
        }
      }


      if(Object.keys(this.lastSelectedSlots[supervisor]).length !== countAlreadySelectedSlots){
        this.updateCommitteeSchedule(this.lastSelectedSlots[supervisor]);
        console.log('select');
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
        this.committeeMultipleSelection = this.selectedSlots[supervisor][this.start.time].committeeIdentifier;
      } else {
        this.committeeMultipleSelection = null;
      }

      if(countSameRole === Object.keys(this.lastSelectedSlots[supervisor]).length){
        this.roleMultipleSelection = this.selectedSlots[supervisor][this.start.time].chairperson;
      } else {
        this.roleMultipleSelection = false;
      }

      if(this.roleMultipleSelection){
        if(countSameClass === Object.keys(this.lastSelectedSlots[supervisor]).length){
          this.classMultitpleSelection.setValue(this.selectedSlots[supervisor][this.start.time].classroom)
        } else {
          this.classMultitpleSelection.setValue(null);
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


    this.start = { supervisor: '', time: '' };
    this.end = { supervisor: '', time: '' };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }



}
