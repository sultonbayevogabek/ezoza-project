import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { arrayMinLength } from '../validators/array-min-length.validator';
import { StoryService } from '../services/story.service';

@Component({
  selector: 'add-story',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-story.component.html',
  styleUrl: './add-story.component.css'
})

export class AddStoryComponent implements OnInit {
  @Input() coordinates: number[] = []
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  @Output('onStoryCreated') storyCreated = new EventEmitter<void>();
  @Output('onClose') close = new EventEmitter<void>();

  private _storyService = inject(StoryService);

  imagesBuffers: (string | ArrayBuffer)[] = [];
  storyForm = new FormGroup({
    images: new FormControl([], arrayMinLength(1)),
    comment: new FormControl('Bu damir yol instdan olingan rasmlar', [Validators.required]),
    lat: new FormControl(null, [Validators.required]),
    long: new FormControl(null, [Validators.required])
  })

  ngOnInit() {
    this.storyForm.get('lat').setValue(this.coordinates[0]);
    this.storyForm.get('long').setValue(this.coordinates[1]);
  }

  onImagesSelectedByFileInput($event: Event): void {
    this.onImagesDropped(($event.target as HTMLInputElement).files);
    this.fileInput.nativeElement.value = null;
  }

  onImagesDropped($event: FileList): void {
    for (const file of Array.from($event)) {
      if (![ 'image/jpeg', 'image/png' ].includes(file.type)) {
        continue;
      }

      this.transformImageFile(file);
    }
  }

  transformImageFile(file: File): void {
    const reader = new FileReader();
    reader.onload = event => {
      const buffer = event.target.result;
      if (this.imagesBuffers.find(item => item === buffer) || this.imagesBuffers.length === 5) {
        return;
      }
      this.imagesBuffers.push(buffer);
      const images: File[] = this.storyForm.get('images').value;
      images.push(file);
      this.storyForm.get('images').setValue(images);
    };
    reader.readAsDataURL(file);
  }

  removeImage(i: number): void {
    this.imagesBuffers.splice(i, 1);
    const images: File[] = this.storyForm.get('images').value;
    images.splice(i, 1);
    this.storyForm.get('images').setValue(images);
  }

  createStory(): void {
    const form = this.storyForm;

    if (form.invalid) return;

    const data = form.getRawValue();
    const formData = new FormData();

    for (const key in data) {
      const value = data[key];
      if ('images' === key) {
        value.forEach((item: any) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value);
      }
    }

    this._storyService.createStory(formData)
      .subscribe(res => {
        this.storyCreated.emit();
      })
  }

  closeAddStory() {
    this.close.emit()
  }
}
