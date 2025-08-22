// Import angular.
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';

// Import material angular.
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// Import component.
import { MapAdminComponent } from './map-admin/map-admin.component'
import { TabsAdminComponent } from './tabs-admin/tabs-admin.component'
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-admin',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,

    MapAdminComponent,
    TabsAdminComponent,
    MatProgressSpinnerModule,

  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  constructor(
    public DataService: DataService,
  ) { }


  async ngOnInit() {
    this.DataService.loadingAdmin = true; // Ενεργοποίηση spinner.
    await this.DataService.insertDataServer(); // Κάλεσμα δεδομένων.
    this.DataService.loadingAdmin = false; // Απενεργοποίηση spinner.
  }





}
