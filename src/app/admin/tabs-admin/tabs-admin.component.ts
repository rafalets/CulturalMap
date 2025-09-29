// Angular
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatTabsModule, } from '@angular/material/tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';

// Components
import { EventsAdminComponent } from './events-admin/events-admin.component';
import { StatusAdminComponent } from './status-admin/status-admin.component';
import { DataService } from './../../../services/data.service';



@Component({
  selector: 'app-tabs-admin',
  imports: [
    CommonModule,

    MatTabsModule,

    EventsAdminComponent,
    StatusAdminComponent,
  ],
  templateUrl: './tabs-admin.component.html',
  styleUrl: './tabs-admin.component.scss'
})
export class TabsAdminComponent {

  // indexTabs: any = 0 // Το επιλεγμένο index στα Tabs.

  constructor(
    public DataService: DataService,
    // Απαραίτητο για την αναγκαστική ενημέρωση του Angular
    private cdr: ChangeDetectorRef,
  ) { }

  changeTabs(event: any) {
    this.DataService.indexTabs = event.index // Το επιλεγμένο index στα Tabs.
  }

}
