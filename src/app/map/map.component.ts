import { Component, HostListener, inject, NgZone, ViewChild } from '@angular/core';
import { YandexMapsService } from '../services/yandex-maps.service';
import { Router } from '@angular/router';
import { AddStoryComponent } from '../add-story/add-story.component';
import { StoryService } from '../services/story.service';
import { CarouselComponent, CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    AddStoryComponent,
    CarouselModule
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  providers: [YandexMapsService]
})

export class MapComponent {
  @ViewChild('carouselComponent') carouselComponent: CarouselComponent;
  @HostListener('keydown', [ '$event' ])

  closeModals(event: KeyboardEvent) {
    console.log(event.key);
    if (event.key === 'Escape') {
      this.isStoryModalOpen = false;
      this.isSliderOpen = false;
    }
  }

  isStoryModalOpen = false;
  isSliderOpen = false;
  environment = environment

  coordinates: number[];
  stories = [];
  selectedStories = [];

  thumbsCarouselOption: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    items: 1,
    nav: false,
    autoWidth: false,
    autoplay: false,
  };

  private _yandexMapService = inject(YandexMapsService);
  private _storypService = inject(StoryService);
  private _router = inject(Router);
  private _ngZone = inject(NgZone);

  ngOnInit(): void {
    this.getStories();
    this._yandexMapService.$placemark
      .subscribe(index => {
        if (index === null) return;

        this._ngZone.run(() => {
          this._router.navigate(['/panorama/', index.toString()]).then()
        })
      })

    this._yandexMapService.$storiesPlacemark.subscribe(coords => {
      this._ngZone.run(() => {
        this.coordinates = coords;
        this.getStoryByLocation();
      })
    })

    this._yandexMapService.$mapClick.subscribe(coords => {
      this._ngZone.run(() => {
        this.coordinates = coords;
        this.openStoryModal();
      })
    })
  }

  openStoryModal(): void {
    this.isStoryModalOpen = true;
  }

  getStories(): void {
    this._storypService.getStories()
      .subscribe(res => {
        this.stories = res?.data;
        console.log(this.stories);
        this._yandexMapService.setMultipleLocationPoints(this.stories);
      })
  }

  onStoryCreated() {
    window.location.reload();
  }

  getStoryByLocation(): void {
    this._storypService.getStoryByCoords(this.coordinates)
      .subscribe(res => {
        this.selectedStories = res?.data?.images || [];
        console.log(this.selectedStories);
        this.isSliderOpen = true;
      })
  }

  navigateCarousel(direction: 'next' | 'prev'): void {
    this.carouselComponent[direction]();
  }

  addHistory(): void {
    this.isSliderOpen = false;
    this.isStoryModalOpen = true;
  }
}
