import { Component, Input, OnDestroy, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { DefenseScheduleService } from '../../defense-schedule.service';
import {  ChairpersonAssignment, SupervisorDefenseAssignment, SupervisorStatistics } from '../../models/defense-schedule.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil} from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/modules/user/user.service';
import { Supervisor } from 'src/app/modules/user/models/supervisor.model';
import { HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';

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
  @Input() defenseAssignment!: {[key: string]: { [key: string]: SupervisorDefenseAssignment }};
  @Input() chairpersonAssignment!: {[key: string]: ChairpersonAssignment };
  supervisors!: Supervisor[];
  supervisorsIndexes: string[] = [];
  times: string[] = [];
  statistics: SupervisorStatistics[] = [];

  slotsSelected: boolean = false;
  hoveredSlots: {[key: string]: {[key: string]: boolean}} = {};
  selectedSlots!: {[key: string]: { [key: string]: SupervisorDefenseAssignment }}
  lastSelectedSlots: {[key: string]: {[key: string]: SupervisorDefenseAssignment}} = {};
  lastSelectedSupervisor: string = '';
  start: SupervisorTimeReference = { supervisor: '', time: '' }
  end: SupervisorTimeReference = { supervisor: '', time: '' }
  over: SupervisorTimeReference = { supervisor: '', time: '' }
  cursorPositionY = '';
  cursorPositionX = '';

  committeeMultipleSelection: string | null = null;
  classroomFormControls: {[key: string]: FormControl} = {
    'A': new FormControl<string | null>(null),
    'B': new FormControl<string | null>(null),
    'C': new FormControl<string | null>(null),
    'D': new FormControl<string | null>(null)
  }

  unsubscribe$ = new Subject();

  constructor(private defenseScheduleService: DefenseScheduleService, private userService: UserService){
    this.userService.supervisors$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      supervisors => this.supervisors = supervisors
    )

    this.defenseScheduleService.getSupervisorsStatistics().pipe(takeUntil(this.unsubscribe$)).subscribe(
      statistics => this.statistics = statistics
    )
  }

  ngOnInit(): void {
    ['A', 'B', 'C', 'D'].forEach(committee => {
      this.classroomFormControls[committee].valueChanges.pipe(takeUntil(this.unsubscribe$), debounceTime(500), distinctUntilChanged())
      .subscribe((value: string | null) => {
          let classroom = value;
          if(classroom === '') classroom = null;
          this.chairpersonAssignment[committee].classroom = classroom;
          this.updateChairpersonAssignment(this.chairpersonAssignment[committee]) 
      })
    })
  }
  

  ngOnChanges(): void {
    this.selectedSlots = this.defenseAssignment;
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

    if(this.chairpersonAssignment){
      for(let assignment of Object.values(this.chairpersonAssignment)){
        this.classroomFormControls[assignment.committeeIdentifier].setValue(assignment.classroom);
      }
    }
  }

  updateChairpersonAssignment(chairpersonAssignment: ChairpersonAssignment){
    this.defenseScheduleService.updateChairpersonAssignment(chairpersonAssignment).pipe(takeUntil(this.unsubscribe$))
      .subscribe()
  }

  updateCommitteeSchedule(slots: {[key: string]: SupervisorDefenseAssignment}){
    this.defenseScheduleService.updateCommitteeSchedule(slots).pipe(takeUntil(this.unsubscribe$)).subscribe(
      statistics => this.statistics = statistics
    )
  }

  multipleCommitteeSelectionChanged(event: MatSelectChange){
    const supervisor = this.lastSelectedSupervisor;
    for(let t of Object.keys(this.lastSelectedSlots[supervisor])){
      this.lastSelectedSlots[supervisor][t].committeeIdentifier = event.value;
      this.selectedSlots[supervisor][t].committeeIdentifier = event.value;
    }
    this.updateCommitteeSchedule(this.lastSelectedSlots[supervisor])
  }

  committeeChairpersonSelected(event: MatSelectChange, committeeIdentifier: string){
    this.chairpersonAssignment[committeeIdentifier].chairpersonId = event.value;
    this.updateChairpersonAssignment(this.chairpersonAssignment[committeeIdentifier])
  }

  unselectSlots(){
    const supervisor = this.lastSelectedSupervisor;
    for(let t of Object.keys(this.lastSelectedSlots[supervisor])){
        this.lastSelectedSlots[supervisor][t].committeeIdentifier = null
        this.selectedSlots[supervisor][t].committeeIdentifier = null
    }
  
    this.updateCommitteeSchedule(this.lastSelectedSlots[supervisor])

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

  getDefenseSummary(){
    this.defenseScheduleService.getDefenseSummary().pipe(takeUntil(this.unsubscribe$)).subscribe(
      (file: HttpResponse<Blob>) => {
        if(file?.body){
          saveAs(file.body!, 'summary.pdf')
        }
      }
    )
  }

  resetSlotsSelection(){
    this.start = { supervisor: '', time: '' };
    this.end = { supervisor: '', time: '' };
    this.supervisors.forEach(supervisor => {
      this.hoveredSlots[supervisor.indexNumber] = {};
      this.times.forEach(time => {
        this.hoveredSlots[supervisor.indexNumber][time] = false;
      })
    });
  }


  onMouseDown(supervisor: string, time: string){
    for(let supervisor of Object.keys(this.selectedSlots)){
      this.lastSelectedSlots[supervisor] = {};
    }
    this.slotsSelected = false;
    this.hoveredSlots[supervisor][time] = true;
    this.start = {supervisor, time}
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
  
        if(timeIndex > startIndex && timeIndex > overIndex){
          this.hoveredSlots[supervisor][t] = false;
        }
      }
    } else {
      this.resetSlotsSelection()
    }
  }

  findCellTargetElement(event: MouseEvent): HTMLElement{
    let target = event.target as HTMLElement;
    while(target.tagName !== 'TD'){
      target = target.parentElement!;
    }
    return target;
  }

  calculateCommitteeSelectionContainerPosition(target: HTMLElement){
    let rect = target.getBoundingClientRect();
    let matTabBodyRect = document.getElementsByClassName('mat-mdc-tab-body-active')[0].getBoundingClientRect();
    this.cursorPositionX = `${rect.x + rect.width - matTabBodyRect.x}px`;
    this.cursorPositionY = `${rect.y - matTabBodyRect.y}px`;
  }
  
  onMouseUp(supervisor: string, time: string, event: MouseEvent){
    this.end = {supervisor, time};
    const startIndex = this.times.indexOf(this.start.time);
    const endIndex = this.times.indexOf(this.end.time);

    let target = this.findCellTargetElement(event);
    this.calculateCommitteeSelectionContainerPosition(target);

    let countAlreadySelectedSlots = 0;

    if(this.end.supervisor === this.start.supervisor){
      this.slotsSelected = true;
      
      for(let t of Object.keys(this.selectedSlots[supervisor])){
        const timeIndex = this.times.indexOf(t);
        const committeeIdentifier = this.selectedSlots[supervisor][t].committeeIdentifier;

        if((timeIndex >= startIndex && timeIndex <= endIndex) || (timeIndex <= startIndex && timeIndex >= endIndex)){
          committeeIdentifier ? countAlreadySelectedSlots++ : this.selectedSlots[supervisor][t].committeeIdentifier = 'A';
          const selectedSlotDeepCopy = JSON.parse(JSON.stringify(this.selectedSlots[supervisor][t]));
          this.lastSelectedSlots[supervisor][t] = selectedSlotDeepCopy;
        }
      }
    
      if(Object.keys(this.lastSelectedSlots[supervisor]).length !== countAlreadySelectedSlots){
        this.updateCommitteeSchedule(this.lastSelectedSlots[supervisor]);
      }

      
      let countSameCommittee = 0;
      for(let t of Object.keys(this.lastSelectedSlots[supervisor])){
        if(this.lastSelectedSlots[supervisor][t].committeeIdentifier === this.selectedSlots[supervisor][this.start.time].committeeIdentifier){
          countSameCommittee++;
        }
      }

      const everySlotHasSameCommittee = countSameCommittee === Object.keys(this.lastSelectedSlots[supervisor]).length;
      this.committeeMultipleSelection = everySlotHasSameCommittee ? this.selectedSlots[supervisor][this.start.time].committeeIdentifier : this.committeeMultipleSelection = null;

      this.lastSelectedSupervisor = this.start.supervisor;
    }
    
    this.resetSlotsSelection();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }



}
