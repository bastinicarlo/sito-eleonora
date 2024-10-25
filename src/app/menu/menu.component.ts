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

  isActive(s: string){
    return (this.activePage == s)/* || this.router.url == '/'+ s*/;
  }

  public login(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.email = result;
        this.cookieService.set('email', result);
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
}