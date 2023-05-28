import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { userReducer } from './state/user.reducer';
import { UserEffects } from './state/user.effects';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature('user', userReducer),
    EffectsModule.forFeature([UserEffects])
  ]
})
export class UserModule { }
