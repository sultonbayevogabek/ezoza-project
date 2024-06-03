import { YaApiLoaderService } from 'angular8-yandex-maps';
import { ElementRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class YandexMapsService {
  private _map: ymaps.Map;
  private _yandexApiLoaderService: YaApiLoaderService = inject(YaApiLoaderService);
  private _elementRef = inject(ElementRef);
  _border = [
    [
      41.272022264963475, 69.27941175984871
    ],
    [
      41.272659693935914,
      69.28302880432125
    ],
    [
      41.27692644374709,
      69.28731014939876
    ],
    [
      41.27926745761849,
      69.28225632812499
    ],
    [
      41.27418021395516,
      69.27707430030817
    ],
    [
      41.272022264963475, 69.27941175984871
    ]
  ];
  points = [
    {
      coordinates: [ 41.276277, 69.283797 ],
      thumbImgUrl: 'assets/thumbs/archazor.png',
      panoramaImgUrl: 'assets/panoramas/archazor.jpg'
    },
    {
      coordinates: [ 41.273826, 69.278521 ],
      thumbImgUrl: 'assets/thumbs/arka.png',
      panoramaImgUrl: 'assets/panoramas/arka.jpg'
    },
    {
      coordinates: [ 41.276748, 69.281424 ],
      thumbImgUrl: 'assets/thumbs/hovli.png',
      panoramaImgUrl: 'assets/panoramas/hovli.jpg'
    },
    {
      coordinates: [ 41.276406, 69.280848 ],
      thumbImgUrl: 'assets/thumbs/magistral.png',
      panoramaImgUrl: 'assets/panoramas/magistral.jpg'
    },
    {
      coordinates: [ 41.276749, 69.282901 ],
      thumbImgUrl: 'assets/thumbs/poligon.png',
      panoramaImgUrl: 'assets/panoramas/poligon.jpg'
    },
    {
      coordinates: [ 41.276492, 69.283424 ],
      thumbImgUrl: 'assets/thumbs/poligon-darvozasi.png',
      panoramaImgUrl: 'assets/panoramas/poligon-darvozasi.jpg'
    },
    {
      coordinates: [ 41.276064, 69.283022 ],
      thumbImgUrl: 'assets/thumbs/qabul.png',
      panoramaImgUrl: 'assets/panoramas/qabul.jpg'
    },
    {
      coordinates: [ 41.276901, 69.281152 ],
      thumbImgUrl: 'assets/thumbs/qurilish.png',
      panoramaImgUrl: 'assets/panoramas/qurilish.jpg'
    },
    {
      coordinates: [ 41.275423, 69.282212 ],
      thumbImgUrl: 'assets/thumbs/sport_kompleksi.png',
      panoramaImgUrl: 'assets/panoramas/sport_kompleksi.jpg'
    },
    {
      coordinates: [ 41.275473, 69.283041 ],
      thumbImgUrl: 'assets/thumbs/yotoqxona.png',
      panoramaImgUrl: 'assets/panoramas/yotoqxona.jpg'
    }
  ];

  public $placemark: Subject<number> = new Subject()
  public $storiesPlacemark: Subject<number[]> = new Subject();
  public $mapClick: Subject<number[]> = new Subject();

  setMultipleLocationPoints(stories: any[]): void {
    this._yandexApiLoaderService.load()
      .subscribe(_ => {
        this._map = new ymaps.Map('map', {
          center: this._border[0],
          zoom: 6,
          controls: [ 'typeSelector', 'zoomControl' ],
          bounds: [
            [ 41.278946, 69.277331 ],
            [ 41.272167, 69.288213 ]
          ],
          type: 'yandex#map'
        });

        const polyline = new ymaps.Polyline(
          this._border,
          {},
          {
            strokeColor: '#3336FF',
            strokeWidth: 8,
            strokeOpacity: 0.7
          }
        );
        this._map.geoObjects.add(polyline);

        this.points.forEach((point, index) => {
          const myPlacemark = new ymaps.Placemark(point.coordinates, {
          }, {
            iconLayout: 'default#image',
            iconImageHref: point.thumbImgUrl,
            iconImageSize: [ 60, 60 ],
            iconImageOffset: [ -30, -60 ]
          });

          myPlacemark.events.add('click', (event) => {
            console.log(event.get('coordinates'));
            this.$placemark.next(index);
          });

          this._map.geoObjects.add(myPlacemark);
        });

        const MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
          '<div style="width: 40px; height: 40px; line-height: 40px; color: #000000; text-align: center">$[properties.iconContent]</div>'
        )

        console.log('Stories', stories);

        stories?.forEach((point, index) => {
          const myPlacemarkWithContent = new ymaps.Placemark(
            [+point?.location[0], +point?.location[1]], {
            iconContent: '' + point?.images?.length
          }, {
            iconLayout: 'default#imageWithContent',
            iconImageHref: 'assets/story.png',
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -20],
            iconContentLayout: MyIconContentLayout
          });

          myPlacemarkWithContent.events.add('click', (event) => {
            this.$storiesPlacemark.next([+point?.location[0], +point?.location[1]]);
          });

          this._map.geoObjects.add(myPlacemarkWithContent);
        });

        this._map.events.add('click', e => {
          this.$mapClick.next(e.get('coords'));
        });

        const bounds = this._map.geoObjects.getBounds();

        if (bounds) {
          const { clientWidth, clientHeight } = this._elementRef.nativeElement.querySelector('#map');
          const { center, zoom }: { center?: number[], zoom?: number } = ymaps.util.bounds.getCenterAndZoom(
            bounds, [ clientWidth, clientHeight ]
          );
          this._map.setCenter(center);
        }

        this._map.options.set('restrictMapArea', [
          [ 41.285127, 69.271270 ],
          [ 41.264827, 69.296891 ]
        ]);
      });
  }
}
