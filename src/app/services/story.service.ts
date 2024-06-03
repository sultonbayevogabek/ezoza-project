import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class StoryService {
  private http = inject(HttpClient);

  createStory(payload: FormData): Observable<any> {
    return this.http.post(environment.host + 'create-location-data', payload);
  }

  getStories(): Observable<any> {
    return this.http.get(environment.host + 'get-all-data');
  }

  getStoryByCoords(coords: number[]): Observable<any> {
    return this.http.post(environment.host + 'get-location-data', {
      lat: coords[0],
      long: coords[1],
    });
  }
}
