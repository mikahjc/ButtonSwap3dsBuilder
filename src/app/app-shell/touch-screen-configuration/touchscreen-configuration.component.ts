import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Mapping} from '../../../../shared/model/mapping';
import {Buttons} from '../../../../shared/model/buttons';
import {Coordinates} from '../../../../shared/model/coordinates';

@Component({
  selector: 'app-touchscreen-configuration',
  templateUrl: './touchscreen-configuration.component.html',
  styleUrls: ['./touchscreen-configuration.component.css']
})
export class TouchscreenConfigurationComponent implements OnInit {

  @Input() mappings: Array<Mapping<Buttons, Coordinates>>;
  @Input() rehidMode: boolean;
  @Output() mappingsChange = new EventEmitter<Array<Mapping<Buttons, Coordinates>>>();
  currentMapping: Mapping<Buttons, Coordinates>;
  background: string;
  constructor() {
    this.currentMapping = new Mapping(new Buttons(), new Coordinates());
  }

  ngOnInit() {
  }

  touchscreenDragging(event: MouseEvent, crosshair: boolean, axis: string = '') {
    event.stopPropagation();
    if (event.buttons === 1) {
      if ((crosshair && axis.toLowerCase() === 'y') || !crosshair) {
        this.currentMapping.output.x = event.offsetX;
      }
      if ((crosshair && axis.toLowerCase() === 'x') || !crosshair) {
        this.currentMapping.output.y = 240 - event.offsetY;
      }
    }
  }

  touchscreenClick(event: MouseEvent) {
    this.currentMapping.output.x = event.offsetX;
    this.currentMapping.output.y = 240 - event.offsetY;
  }

  touchscreenCrosshairClick(event: MouseEvent, axis: string) {
    event.stopPropagation();
    switch (axis.toLowerCase()) {
      case 'x':
        this.currentMapping.output.y = 240 - event.offsetY;
        break;
      case 'y':
        this.currentMapping.output.x = event.offsetX;
        break;
      default:
        throw new Error('invalid axis');
    }
  }

  onTouchscreenFileSelect(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.background = reader.result as string;
      };
    }
  }

  saveCurrent() {
    this.mappings.push(this.currentMapping);
    this.currentMapping = new Mapping(new Buttons(), new Coordinates());
  }

  loadMapping(mapping: Mapping<Buttons, Coordinates>) {
    if (mapping === this.currentMapping) {
      this.currentMapping = new Mapping(new Buttons(), new Coordinates());
    } else {
      this.currentMapping = mapping;
    }
  }

  deleteMapping(mapping: Mapping<Buttons, Coordinates>) {
    this.mappings = this.mappings.filter((value) => value !== mapping);
    this.mappingsChange.emit(this.mappings);
  }

  getBackground(): string {
    return `url(${this.background})`;
  }

}
