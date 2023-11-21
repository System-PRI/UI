import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'defense-date-range-selection',
  templateUrl: './defense-date-range-selection.component.html',
  styleUrls: ['./defense-date-range-selection.component.scss']
})
export class DefenseDateRangeSelectionComponent {
  form = this.fb.group({
    start: [null, Validators.required],
    end: [null, Validators.required],
    time: [null, Validators.required]
  })

  constructor(private fb: FormBuilder){}

  onSubmit(): void {
    if (this.form.valid) {    
      
    }
  }
}
