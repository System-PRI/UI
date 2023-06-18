import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ExternalLinkService } from '../../external-link.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';
import { projectAcceptedByStudent } from 'src/app/modules/user/state/user.selectors';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ExternalLink } from '../../models/external-link.model';

@Component({
  selector: 'external-link-form',
  templateUrl: './external-link-form.component.html',
  styleUrls: ['./external-link-form.component.scss']
})
export class ExternalLinkFormComponent implements OnDestroy {

  form = this.fb.group({
    externalLinks: this.fb.array<ExternalLink>([]),
  });
  unsubscribe$ = new Subject();

  constructor(private fb: FormBuilder, private store: Store<State>, private externalLinkService: ExternalLinkService) { }

  ngOnInit(): void {
    this.store.select(projectAcceptedByStudent).pipe(
      takeUntil(this.unsubscribe$),
      switchMap(projectId => this.externalLinkService.getExternalLinks(projectId))
    ).subscribe(
      externalLinks => {
        externalLinks.forEach(externalLink => {
          this.externalLinks.push(this.fb.group({
            id: externalLink.id,
            url: externalLink.url,
            name: externalLink.name,
            columnHeader: externalLink.columnHeader,
            deadline: externalLink.deadline
        }))
      })
    })
  }

  getErrorMessage(): string {
      return 'You must enter a value';
  }

  getFormControl(externalLink: AbstractControl): {name: string, url: FormControl} {
    return {
      name: externalLink.get('name')?.value,
      url: externalLink.get('url') as FormControl
    }
  }


  onSubmit(): void {
    if(this.form.valid){
     
    }
  }

  get externalLinks(): FormArray {
    return this.form.get('externalLinks') as FormArray;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }

}
