import { AfterViewInit, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { YandexMapsService } from '../services/yandex-maps.service';

@Component({
  selector: 'app-panorama',
  standalone: true,
  imports: [],
  templateUrl: './panorama.component.html',
  styleUrl: './panorama.component.css',
  providers: [YandexMapsService]
})

export class PanoramaComponent implements AfterViewInit {
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _yandexMapsService =  inject(YandexMapsService);
  private _router = inject(Router);

  ngAfterViewInit() {
    this._activatedRoute.params.subscribe((params: { index: number}) => {
        // @ts-ignore
        window.pannellum.viewer('panorama', {
          "type": "equirectangular",
          "panorama": this._yandexMapsService.points[params?.index].panoramaImgUrl,
          "autoLoad": true,
          "loading": "Yuklanmoqda"
        });
    })
  }

  back(): void {
    this._router.navigate(['/']).then();
  }
}
