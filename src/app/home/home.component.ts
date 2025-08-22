// Import angular.
import { Component } from '@angular/core';

// Import material angular.
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// Import component.
import { MapComponent } from './map/map.component'
import { EventsComponent } from './events/events.component'
import { DataService } from '../../services/data.service';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,

    MapComponent,
    EventsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    constructor(
      public DataService: DataService,
    ) { }
  
    loading = false; // Βοηθάει να φαίνεται ή να μη φαίνεται το Spinner στο Save.
  
    async ngOnInit() {
      this.loading = true; // Ενεργοποίηση spinner.
      await this.DataService.insertDataServer(); // Κάλεσμα δεδομένων.
      this.loading = false; // Απενεργοποίηση spinner.
    }

}
