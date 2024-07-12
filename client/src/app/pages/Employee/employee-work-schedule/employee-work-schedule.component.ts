import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbars/navbar/navbar.component';
import { WorkScheduleEntryService } from '../../../services/work-schedule-entry.service';
import { JwtDecodeService } from '../../../services/jwt-decode.service';

@Component({
  selector: 'app-employee-work-schedule',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './employee-work-schedule.component.html',
  styleUrls: ['./employee-work-schedule.component.css'],
  providers: [WorkScheduleEntryService]
})
export class EmployeeWorkScheduleComponent {
  currentLoggedInUserId: string = "";
  allWorkScheduleEntries: Array<any>= [];
  daysOfTheWeek: Array<any> = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  uniqueTimeSlots: Array<any> = [];


  constructor(
    private workScheduleEntryService: WorkScheduleEntryService,
    private jwtDecodeService: JwtDecodeService
  ) {
    this.getAllWorkScheduleEntries();
    this.currentLoggedInUserId = this.jwtDecodeService.decodeToken(localStorage.getItem('access_token'))?.id;
  }

  getAllWorkScheduleEntries() {
    this.workScheduleEntryService.getAllWorkScheduleEntries()
    .subscribe({
      next: (res) => {
        console.log(res.data)

        this.allWorkScheduleEntries = res.data;
        this.makeUniqueArrayWithTimeSlots();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateWorkScheduleEntry(workScheduleEntryObj: any) {
    this.workScheduleEntryService.updateWorkScheduleEntry(workScheduleEntryObj)
    .subscribe({
      next: (res) => {
        console.log(res.data)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  makeUniqueArrayWithTimeSlots() {
    var uniqueTimeSlots = new Set();

    for (var i = 0; i < this.allWorkScheduleEntries.length; i++) {
      uniqueTimeSlots.add(this.allWorkScheduleEntries[i].timeSlot);
    }

    this.uniqueTimeSlots = Array.from(uniqueTimeSlots);
  }

  getEmployeesForShift(day: string, timeSlot: string): string[] {
    const matchingEntries = this.allWorkScheduleEntries.filter(
      (scheduleEntry) => scheduleEntry.dayOfWeek === day && scheduleEntry.timeSlot === timeSlot
    );
  
    // Inicjalizacja tablicy na pracowników
    const employeesForShift: string[] = [];
  
    // Sprawdź, czy są odpowiednie wpisy w harmonogramie
    if (matchingEntries.length === 2) {
      employeesForShift.push(matchingEntries[0].firstEmployee.firstName.charAt(0) + '. ' + matchingEntries[0].firstEmployee.lastName, matchingEntries[1].secondEmployee.firstName);
    } else if (matchingEntries.length === 1) {
      if (matchingEntries[0].firstEmployee) {
        employeesForShift.push(matchingEntries[0].firstEmployee.firstName.charAt(0) + '. ' + matchingEntries[0].firstEmployee.lastName);
      }
      if (matchingEntries[0].secondEmployee) {
        employeesForShift.push(matchingEntries[0].secondEmployee.firstName.charAt(0) + '. ' + matchingEntries[0].secondEmployee.lastName);
      }
    }
  
    return employeesForShift;
  }

  getWorkEntryId(day: string, timeSlot: string, index: number): string {
    const matchingEntry = this.allWorkScheduleEntries.find(
      (scheduleEntry) =>
        scheduleEntry.dayOfWeek === day &&
        scheduleEntry.timeSlot === timeSlot &&
        scheduleEntry.firstEmployee // Sprawdzamy, czy istnieje pierwszy pracownik
    );
  
    return matchingEntry ? matchingEntry._id : ''; // Zwracamy ID lub pusty ciąg znaków, jeśli nie znaleziono pasującego wpisu
  }

  getEmployeeIdForShift(day: string, timeSlot: string, index: number): string {
    const matchingEntry = this.allWorkScheduleEntries.find(
      (scheduleEntry) =>
        scheduleEntry.dayOfWeek === day &&
        scheduleEntry.timeSlot === timeSlot &&
        scheduleEntry.firstEmployee // Sprawdzamy, czy istnieje pierwszy pracownik
    );
  
    if (matchingEntry) {
      if (index === 0) {
        return matchingEntry.firstEmployee._id;
      } else if (index === 1 && matchingEntry.secondEmployee) {
        return matchingEntry.secondEmployee._id;
      }
    }
  
    return ''; // Zwracamy pusty ciąg znaków, jeśli nie znaleziono pasującego wpisu lub pracownika
  }
}
