/*
 * This is a collection module for the different type
 * of material design elements. If you need any
 * other elements then you need to add them here.
 * This will be passed on through the core module.
 */

import { NgModule} from '@angular/core';
import { MatButtonModule,
         MatCheckboxModule,
         MatIconModule,
         MatCardModule,
         MatTabsModule,
         MatInputModule,
         MatNativeDateModule,
         MatDatepickerModule,
         MatRadioModule,
         MatSelectModule,
         MatSliderModule,
         MatSlideToggleModule,
         MatMenuModule,
         MatToolbarModule,
         MatButtonToggleModule,
         MatProgressSpinnerModule,
         MatProgressBarModule,
         MatDialogModule,
         MatTooltipModule,
         MatSnackBarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        MatButtonModule, MatCheckboxModule,
        MatIconModule, MatCardModule, MatTabsModule,
        MatInputModule, MatDatepickerModule,
        MatNativeDateModule, MatRadioModule,
        MatSelectModule, MatSliderModule,
        MatSlideToggleModule, MatMenuModule,
        MatToolbarModule, MatButtonToggleModule,
        MatProgressSpinnerModule, MatProgressBarModule,
        MatDialogModule, MatTooltipModule,
        MatSnackBarModule
    ],
    exports: [
        MatButtonModule, MatCheckboxModule,
        MatIconModule, MatCardModule, MatTabsModule,
        MatInputModule, MatDatepickerModule,
        MatNativeDateModule, MatRadioModule,
        MatSelectModule, MatSliderModule,
        MatSlideToggleModule, MatMenuModule,
        MatToolbarModule, MatButtonToggleModule,
        MatProgressSpinnerModule, MatProgressBarModule,
        MatDialogModule, MatTooltipModule,
        MatSnackBarModule
    ]
})
export class MaterialModule { }
