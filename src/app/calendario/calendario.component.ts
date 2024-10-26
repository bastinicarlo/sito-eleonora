import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { sede } from '../interface/sede';
import { corso } from '../interface/corso';
import { corsoDescrizione } from '../interface/corsoDescrizione';
import { prenotazione } from '../interface/prenotazione';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { PrenotazioneDialogComponent } from '../prenotazione-dialog/prenotazione-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { EliminaPrenotazioneDialogComponent } from '../elimina-prenotazione-dialog/elimina-prenotazione-dialog.component';

@Component({
  selector: 'calendario',
  standalone: true,
  imports:[ 
    MatButtonModule, 
    MatFormFieldModule, 
    MatDialogModule, 
    FormsModule 
  ],
  providers:[CookieService],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent {
  //private server: string = "http://localhost:5027/api/";
  private server: string = "http://www.eleonoraboarettofit.com/";
  public sedi: any;
  public corsi: any;
  public corsiDescrizione: any;
  public prenotazioni: any;
  public email: any;
  oggi = new Date();
  giorniDate: any;
  giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
  mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Settembre", "Ottobre", "Novembre", "Dicembre"];

  constructor(private http: HttpClient, public dialog: MatDialog, private cookieService: CookieService ){
    this.getGiornoDate();
    this.getSedi();
    this.getCorsi();
    this.getCorsiDescrizione();
    this.email = this.cookieService.get('email');
    this.getPrenotazioni();
  }

  ngDoCheck() {
    var email = this.email = this.cookieService.get('email');
    if(email != this.email){
      this.email = email;
      this.getPrenotazioni();
      this.getCorsi();
    }
  }
  
  public getSedi(){
    this.http.get<sede[]>(this.server + "sedi").subscribe((data) => {
      this.sedi = data;
    });
  }
  
  public getCorsi(){
    this.http.get<corso[]>(this.server + "corsi").subscribe((data) => {
      this.corsi = data;
    });
  }

  public getCorsiDescrizione(){
    this.http.get<corsoDescrizione[]>(this.server + "corsi/descrizione").subscribe((data) => {
      this.corsiDescrizione = data;
    });
  }
  
  public getPrenotazioni(){
    this.http.get<corsoDescrizione[]>(this.server + "prenotazioni/" + this.email).subscribe((data) => {
      this.prenotazioni = data;
    });
  }

  public getGiornoDate(){
    this.giorniDate = [];
    var giorno = new Date();
    
    for (let i = 0; i < 6; i++) {
      if(giorno.getDay() == 6){
        giorno.setDate(giorno.getDate() + 2);
      }
      else if(giorno.getDay() == 7){
        giorno.setDate(giorno.getDate() + 1);
      }
      this.giorniDate.push(new Date(giorno));
      giorno.setDate(giorno.getDate() + 1);
    }
  }

  public stessoGiorno(c: corso, giorno: Date){
    var data = new Date(c.data);
    return data.getDate() == giorno.getDate();
  }

  public getOrario(c: corso){
    var data = new Date(c.data);
    return data.getHours() +":00 - "+ (data.getHours()+1) +":00";
  }

  public isOggi(c: corso){
    var data = new Date(c.data);
    return data.getDate() == this.oggi.getDate();
  }

  public prenota(c: corso): void {
    const dialogRef = this.dialog.open(PrenotazioneDialogComponent, {
      data: {emailUtente: this.email , nomeCorso: c.nome, dataCorso: c.data, sedeCorso: c.sede}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.email = result;
        this.cookieService.set('email', result)
        var p : prenotazione = {emailUtente: result, nomeCorso: c.nome, dataCorso: c.data, sedeCorso: c.sede};
        this.http.post<prenotazione>(this.server + "prenotazioni", p ).subscribe((data) => {
          this.getPrenotazioni();
        });
      }
    });
  }

  public eliminaPrenotazione(c: corso): void {
    const dialogRef = this.dialog.open(EliminaPrenotazioneDialogComponent, {
      data: {emailUtente: this.email , nomeCorso: c.nome, dataCorso: c.data, sedeCorso: c.sede}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        var p : prenotazione = {emailUtente: this.email, nomeCorso: c.nome, dataCorso: c.data, sedeCorso: c.sede};
        this.http.post<prenotazione>(this.server + "prenotazioni/elimina", p ).subscribe((data) => {
          this.getPrenotazioni();
        });
      }
    });
  }

  public isPrenotato(c: corso){
    if(!this.prenotazioni)
      return false;
    
    var r = false;
    this.prenotazioni.forEach( (p: prenotazione) => {
      if(!r){
        r = p.emailUtente == this.email && p.nomeCorso == c.nome && p.sedeCorso == c.sede && p.dataCorso == c.data;
      }
    });
    return r;
  }

  public percentualePrenotato(n: number, nDisponibili: number, nPrenotati: number){
    if(!nDisponibili)
      return "grigio";
    var percentuale = nPrenotati / nDisponibili;
    if(n/5 + 0.2 <= percentuale)
      return "rosa";
    else
      return "grigio";
  }
}
