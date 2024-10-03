import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { RoutingModule } from './app.routes'
import { CalendarioComponent } from "./calendario/calendario.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RoutingModule, RouterOutlet, MatButtonModule, HomeComponent, MenuComponent, FooterComponent, CalendarioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sito-eleonora';
  //static api = "https://localhost:7212";
}
