import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { corso } from '../interface/corso';
import { corsoDescrizione } from '../interface/corsoDescrizione';
import {formatDate} from '@angular/common';

@Component({
  selector: 'calendario',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent {
  public corsi: any;
  public corsiDescrizione: any;
  oggi = new Date();
  giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
  mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Settembre", "Ottobre", "Novembre", "Dicembre"];

  constructor(private http: HttpClient){
    this.getCorsi();
    this.getCorsiDescrizione();
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

  public getGiornoFeriale(giorno: Date, n: number){
    var g = giorno.getDay() + n;
    if(g <= 5){
      return g;
    }
    return 0;
  }

  public getGiornoFerialeOggi(n: number){
    return this.getGiornoFeriale(this.oggi, n);
  }

  public stessoGiorno(c: corso, giorno: number){
    var data1 = new Date(c.data);
    return data1.getDay() == giorno + 1;
  }

  public getOrario(c: corso){
    var data = new Date(c.data);
    return data.getHours() +":00 - "+ (data.getHours()+1) +":00";
  }
}
