import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrenotazioneDialogComponent } from './prenotazione-dialog.component';

describe('CalendarioComponent', () => {
  let component: PrenotazioneDialogComponent;
  let fixture: ComponentFixture<PrenotazioneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrenotazioneDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrenotazioneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
