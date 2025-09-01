// src/app/components/stars/stars.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-stars',
  imports: [CommonModule],
  templateUrl: './stars.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarsComponent {
  @Input({ required: true }) rating!: number;
  get rounded() { return Math.round(this.rating ?? 0); }
}
