import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-button.component.html',
  styleUrls: ['./seat-button.component.css']
})
export class SeatButtonComponent {
  @Input() public seatNumber: number | undefined;
  @Input() disabled: boolean | undefined;
  @Input() isSelected: boolean = false;

  @Output() sendSelectedSeat = new EventEmitter<number>();

  selectedSeatNumber: number | undefined;

  selectSeat() {
    this.selectedSeatNumber = this.seatNumber;
    this.sendSelectedSeat.emit(this.seatNumber);
  }
}

