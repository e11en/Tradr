import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';


import { CoreModule } from './core/core.module';
import { AppRoutingModule, RoutableComponents } from './app-routing.module';

import { ElectronService } from './services/electron.service';
import { CoinbaseService } from './services/coinbase.service';

@NgModule({
  declarations: [
    AppComponent,
    RoutableComponents
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    CoreModule
  ],
  providers: [ElectronService, CoinbaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
