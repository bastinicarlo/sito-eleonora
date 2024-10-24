import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { sede } from '../interface/sede';
import { corso } from '../interface/corso';
import { corsoDescrizione } from '../interface/corsoDescrizione';
import { prenotazione } from '../interface/prenotazione';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { EmailValidator, FormsModule } from '@angular/forms';
import { PrenotazioneDialogComponent } from '../prenotazione-dialog/prenotazione-dialog.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'calendario',
  standalone: true,
  imports:[ 
    HttpClientModule,
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
  public sedi: any;
  public corsi: any;
  public corsiDescrizione: any;
  public prenotazioni: any;
  public email: any;
  oggi = new Date();
  giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
  mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Settembre", "Ottobre", "Novembre", "Dicembre"];

  constructor(private http: HttpClient, public dialog: MatDialog, private cookieService: CookieService ){
    this.getSedi();
    this.getCorsi();
    this.getCorsiDescrizione();
    this.getPrenotazioni();
    this.email = this.cookieService.get('email');
  }
  
  public getSedi(){
    this.http.get<sede[]>("http://localhost:5027/api/sedi").subscribe((data) => {
      this.sedi = data
    });
  }
  
  public getCorsi(){
    this.http.get<corso[]>("http://localhost:5027/api/corsi").subscribe((data) => {
      this.corsi = data
    });
  }

  public getCorsiDescrizione(){
    this.http.get<corsoDescrizione[]>("http://localhost:5027/api/corsi/descrizione").subscribe((data) => {
      this.corsiDescrizione = data
    });
  }
  
  public getPrenotazioni(){
    this.http.get<corsoDescrizione[]>("http://localhost:5027/api/prenotazioni/" + this.email).subscribe((data) => {
      this.prenotazioni = data
    });
  }

  public getGiorno(giorno: Date){
    var g = giorno.getDay() - 1;
    if(g < 0){
      return 6;
    }
    return g;
  }

  public getGiornoFeriale(giorno: Date, n: number){
    var g = (this.getGiorno(giorno) + n) % 5;
    if(g < 5){
      return g;
    }
    return 0;
  }

  public getGiornoFerialeOggi(n: number){
    return this.getGiornoFeriale(this.oggi, n);
  }

  public stessoGiorno(c: corso, giorno: number){
    var data1 = new Date(c.data);
    return this.getGiorno(data1) == giorno;
  }

  public getOrario(c: corso){
    var data = new Date(c.data);
    return data.getHours() +":00 - "+ (data.getHours()+1) +":00";
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
        console.log(p);
        this.http.post<prenotazione>("http://localhost:5027/api/prenotazioni", p ).subscribe((data) => {
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
}
