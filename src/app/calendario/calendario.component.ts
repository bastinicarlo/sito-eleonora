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
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { utente } from '../interface/utente';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { PrenotazioniDialogComponent } from '../prenotazioni-dialog/prenotazioni-dialog.component';

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
  //private server: string = "https://localhost:44392/api/";
  private server: string = "https://www.eleonoraboarettofit.com/api/";
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
    var email = this.cookieService.get('email');
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
    this.http.get<corsoDescrizione[]>(this.server + "prenotazioni?email=" + this.email).subscribe((data) => {
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
    var durata = 1;
    if(c.durata){
      durata = c.durata;
    }
    if(data.getMinutes() < 10){
      return data.getHours() +":0" + data.getMinutes() + " - "+ (data.getHours() + durata) +":0" + data.getMinutes();
    }
    else{
      return data.getHours() +":" + data.getMinutes() + " - "+ (data.getHours() + durata) +":" + data.getMinutes();
    }
  }

  public isOggi(c: corso){
    var data = new Date(c.data);
    return data.getDate() == this.oggi.getDate();
  }

  public isCancellabile(c: corso){
    var data = new Date(c.data);
    return data.getDate() == this.oggi.getDate() && data.getTime() < this.oggi.getTime() + (2 * 60 * 60 * 1000);
  }

  public checkUser(email: string): Promise<boolean>{
    return this.getUtente(email)
    .then(utente => {
      if (utente && utente.email === email) {
        return true;  // Utente trovato con l'email corrispondente
      } else {
        return false;  // Utente non trovato o email non corrispondente
      }
    })
    .catch(error => {
      const dialogRef = this.dialog.open(ErrorDialogComponent, {
        data: 'Utente non valido'
      });
      return false;
    });
  }

  public getUtente(email: string) : Promise<utente>{
    return new Promise((resolve, reject) => {
      this.http.get<utente>(this.server + "utenti?email=" + email).subscribe(
        (data) => {
          resolve(data);  // Risolvi la promessa con i dati
        },
        (error) => {
          reject(error);  // Rifiuta la promessa in caso di errore
        }

      );
    });
  }

  public async prenota(c: corso): Promise<void> {
    if(!this.email){
      const dialogRef = this.dialog.open(LoginDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      var r : string = result;
      this.checkUser(r.toLowerCase()).then(check => {
        if(r && check){
          this.email = r.toLowerCase();
          this.cookieService.set('email', r.toLowerCase());
          if(!this.isPrenotato(c)){
            this.inserisciPrenotazione(c);
          }
        }
      })
    });
    }
    else{
      this.inserisciPrenotazione(c);
    }
  }
  
  public async prenotati(c: corso): Promise<void> {
    this.http.post<string>(this.server + "prenotazioni/corso", c ).subscribe((data) => {
      const dialogRef = this.dialog.open(PrenotazioniDialogComponent,{data : data});
    });
  }

  public async inserisciPrenotazione(c: corso): Promise<void> {
    const dialogRef = this.dialog.open(PrenotazioneDialogComponent, {
      data: {emailUtente: this.email , nomeCorso: c.nome, dataCorso: c.data, sedeCorso: c.sede}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.email = result;
        this.cookieService.set('email', result)
        var p : prenotazione = {emailUtente: result, nomeCorso: c.nome, dataCorso: c.data, sedeCorso: c.sede};
        this.http.post<prenotazione>(this.server + "prenotazioni", p ).subscribe({
          next: (data) => {
            // Refresh the list of reservations
            this.getPrenotazioni();
          },
          error: (error) => {
            // Show error dialog if something goes wrong
            this.dialog.open(ErrorDialogComponent, {
              data: 'Token Esauriti'
            });
          }
        });
      }
    });
  }

  public async eliminaPrenotazione(c: corso): Promise<void> {
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
