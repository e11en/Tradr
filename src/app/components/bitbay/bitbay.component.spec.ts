import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BitBayComponent } from './bitbay.component';

describe('BitBayComponent', () => {
  let component: BitBayComponent;
  let fixture: ComponentFixture<BitBayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BitBayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BitBayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
