import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { PanoramaComponent } from './panorama/panorama.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', component: MapComponent },
      { path: 'panorama/:index', component: PanoramaComponent },
    ]
  }
];
