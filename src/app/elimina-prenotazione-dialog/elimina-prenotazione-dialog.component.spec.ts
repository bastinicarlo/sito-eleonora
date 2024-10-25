import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EliminaPrenotazioneDialogComponent } from './elimina-prenotazione-dialog.component';

describe('CalendarioComponent', () => {
  let component: EliminaPrenotazioneDialogComponent;
  let fixture: ComponentFixture<EliminaPrenotazioneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminaPrenotazioneDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EliminaPrenotazioneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
