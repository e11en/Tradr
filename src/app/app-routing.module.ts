import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { CoinbaseComponent } from './components/coinbase/coinbase.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'coinbase', component: CoinbaseComponent }    
];

// This way we don't have to declare these double in the app.module.ts
export const RoutableComponents = [
    HomeComponent,
    CoinbaseComponent
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
