import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdaxComponent } from './gdax.component';

describe('GdaxComponent', () => {
  let component: GdaxComponent;
  let fixture: ComponentFixture<GdaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
