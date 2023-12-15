import { Component, Input, OnDestroy, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { DefenseScheduleService } from '../../defense-schedule.service';
import {  SupervisorDefenseAssignment, SupervisorStatistics } from '../../models/defense-schedule.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil} from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/modules/user/user.service';
import { Supervisor } from 'src/app/modules/user/models/supervisor.model';

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
  supervisors!: Supervisor[];
  supervisorsIndexes: string[] = [];
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
  statistics: SupervisorStatistics[] = [];
  
  committiesChairpersonAssignments: { [key:string]: any } = {
    'A': {
      chairpersonId: null,
      class: new FormControl<string | null>(null)
    },
    'B': {
      chairpersonId: null,
      class: new FormControl<string | null>(null)
    },
    'C': {
      chairpersonId: null,
      class: new FormControl<string | null>(null)
    },
    'D': {
      chairpersonId: null,
      class: new FormControl<string | null>(null)
    }
  }

  cursorPositionY = '';
  cursorPositionX = '';
  constructor(private defenseScheduleService: DefenseScheduleService, private userService: UserService){
    this.userService.supervisors$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      supervisors => this.supervisors = supervisors
    )

    this.defenseScheduleService.getSupervisorsStatistics().pipe(takeUntil(this.unsubscribe$)).subscribe(
      statistics => this.statistics = statistics
    )
  }

  ngOnInit(): void {
    this.classMultitpleSelection.valueChanges.pipe(takeUntil(this.unsubscribe$), distinctUntilChanged(),
    debounceTime(500)).subscribe(
      (newValue: string | null) => {
        let classroom = newValue;
        if(classroom === '') classroom = null;
    
        }
    )
  }

  ngOnChanges(): void {
    this.selectedSlots = this.assignment;
    if(this.selectedSlots){
      for(let supervisor of Object.keys(this.selectedSlots)){
        this.supervisorsIndexes.push(supervisor);
        this.hoveredSlots[supervisor] = {};
        this.lastSelectedSlots[supervisor] = {};
  
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
      statistics => this.statistics = statistics
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

  committeeChairpersonSelected(event: MatSelectChange){

  }
  
  multipleRoleSelectionChanged(){
    
  }

  unselectSlots(){
    const supervisor = this.lastSelectionStart.supervisor;
    for(let t of Object.keys(this.selectedSlots[supervisor])){
      const startIndex = this.times.indexOf(this.lastSelectionStart.time);
      const endIndex = this.times.indexOf(this.lastSelectionEnd.time);

      for(let x=startIndex; x <= endIndex; x++){
        const time = this.times[x];
        this.lastSelectedSlots[supervisor][time].committeeIdentifier = null
        this.selectedSlots[supervisor][time].committeeIdentifier = null
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
        this.hoveredSlots[supervisor.indexNumber] = {};
  
        this.times.forEach(time => {
          this.hoveredSlots[supervisor.indexNumber][time] = false;
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
      

      
      let countSameCommittee = 0;

      for(let t of Object.keys(this.lastSelectedSlots[supervisor])){
        if(this.lastSelectedSlots[supervisor][t].committeeIdentifier === this.selectedSlots[supervisor][this.start.time].committeeIdentifier){
          countSameCommittee++;
        }
      }

      if(countSameCommittee === Object.keys(this.lastSelectedSlots[supervisor]).length){
        this.committeeMultipleSelection = this.selectedSlots[supervisor][this.start.time].committeeIdentifier;
      } else {
        this.committeeMultipleSelection = null;
      }
    }

    this.supervisors.forEach(supervisor => {
      this.hoveredSlots[supervisor.indexNumber] = {};

      this.times.forEach(time => {
        this.hoveredSlots[supervisor.indexNumber][time] = false;
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
