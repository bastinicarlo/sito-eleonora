import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import { PageService } from '../service/page.service';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';
import { CalendarioComponent } from '../calendario/calendario.component';
import { utente } from '../interface/utente';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'menu',
  standalone: true,
  imports: [MatButtonModule,
            RouterModule, 
            RouterLink, 
            RouterLinkActive, 
            MatFormFieldModule, 
            MatDialogModule, 
            FormsModule ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  providers: [PageService, CookieService]
})
export class MenuComponent {
  activePage: string = "";
  router = inject(Router)
  public email: any;

  private server: string = "https://localhost:44392/api/";
  //private server: string = "https://www.eleonoraboarettofit.com/api/";
  
  constructor(public pageService: PageService,
              private http: HttpClient,
              public dialog: MatDialog,
              private cookieService: CookieService )
  {
    this.email = this.cookieService.get('email');
  }
  
  ngOnInit() {
    this.pageService.activePage.subscribe(
      (page) => (this.activePage = page)
    );
  }

  ngDoCheck() {
    var email = this.email = this.cookieService.get('email');
    if(email != this.email){
      this.email = email;
    }
  }

  isActive(s: string){
    return (this.activePage == s)/* || this.router.url == '/'+ s*/;
  }

  public login(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        var r : string = result;
        this.checkUser(r.toLowerCase()).then(check => {
          if(r && check){
            this.email = r.toLowerCase();
            this.cookieService.set('email', r.toLowerCase());
          }
      })
      }
    });
  }

  public logout(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {data: this.email});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.email = undefined;
        this.cookieService.delete('email');
      }
    });
  }

  public checkUser(email: string): Promise<boolean>{
    return this.getUtente(email).then(utente => {
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
      return false;  // In caso di errore
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
  
  public getAdmin(email: string, password: string) : Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.http.get<boolean>(this.server + "utenti?email=" + email + "/" + password).subscribe(
        (data) =>{
          resolve(data);
        },
        (error) => {
          reject(error);  // Rifiuta la promessa in caso di errore
        }
      );
    });
  }
}