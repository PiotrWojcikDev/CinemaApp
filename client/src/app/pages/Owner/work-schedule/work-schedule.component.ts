import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbars/navbar/navbar.component';
import { WorkScheduleEntryService } from 'src/app/services/work-schedule-entry.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-work-schedule',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './work-schedule.component.html',
  styleUrls: ['./work-schedule.component.css'],
  providers: [WorkScheduleEntryService, EmployeeService]
})
export class WorkScheduleComponent {
  
  daysOfTheWeek: Array<any> = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  allEmployees: Array<any> = [];
  allWorkScheduleEntries: Array<any>= [];
  uniqueTimeSlots: Array<any> = [];

  selectedEmployee: string | null = null; // Inicjalizujemy jako null, bo początkowo nie ma wybranego pracownika
  selectedDay: string | null = null;
  selectedTimeSlot: string | null = null;
  previousEmployeeId: string | null = null;
  selectedWorkEntryId: string | null = null; // Dodajemy pole do przechowywania ID wpisu pracy
  
  
  constructor(
    private employeeService: EmployeeService,
    private workScheduleEntryService: WorkScheduleEntryService,
    private router: Router,
    private toast: NgToastService,
  ) {
    this.getAllWorkScheduleEntries();
    this.getAllEmployees();
  }

  getAllWorkScheduleEntries() {
    this.workScheduleEntryService.getAllWorkScheduleEntries()
    .subscribe({
      next: (res) => {
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
      },
      error: (err) => {
        this.toast.error({detail:"ERROR", summary: err.error.message, duration: 5000, position: 'topCenter'});
      }
    })
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees()
    .subscribe({
      next: (res) => {
        this.allEmployees = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
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

  onSelect(event: any, day: string, timeSlot: string, workEntryId: string, index: number) {
    // Funkcja, która będzie wywoływana po zmianie opcji w select
    // Aktualizujemy wybrane wartości
    this.selectedEmployee = event.target.value;
    this.selectedDay = day;
    this.selectedTimeSlot = timeSlot;

    // Pobieramy ID pracownika, który nie był zmieniany
    const unmodifiedEmployeeInfo = this.getUnmodifiedEmployeeInfo(day, timeSlot, index);

    this.previousEmployeeId = this.getEmployeeIdForShift(day, timeSlot, index);

    this.selectedWorkEntryId = workEntryId; // Aktualizujemy ID wpisu pracy
    console.log("Prev", this.selectedWorkEntryId);

    if(unmodifiedEmployeeInfo.isSecondEmployee)
      this.updateWorkScheduleEntry({_id: this.selectedWorkEntryId, firstEmployee: this.selectedEmployee, secondEmployee: unmodifiedEmployeeInfo.id});
    else
      this.updateWorkScheduleEntry({_id: this.selectedWorkEntryId, firstEmployee: unmodifiedEmployeeInfo.id, secondEmployee: this.selectedEmployee});
    
    setTimeout(()=>{
      this.refreshComponent();
    }, 1000);
  }
  
  getUnmodifiedEmployeeInfo(day: string, timeSlot: string, index: number): { id: string, isSecondEmployee: boolean } {
    const matchingEntry = this.allWorkScheduleEntries.find(
      (scheduleEntry) =>
        scheduleEntry.dayOfWeek === day &&
        scheduleEntry.timeSlot === timeSlot
    );
  
    if (matchingEntry) {
      if (index === 0) {
        if (matchingEntry.secondEmployee) {
          return { id: matchingEntry.secondEmployee._id, isSecondEmployee: true };
        } else if (matchingEntry.firstEmployee) {
          return { id: matchingEntry.firstEmployee._id, isSecondEmployee: false };
        }
      } else if (index === 1 && matchingEntry.secondEmployee) {
        return { id: matchingEntry.firstEmployee._id, isSecondEmployee: false };
      }
    }
  
    return { id: '', isSecondEmployee: false }; // Zwracamy pusty ciąg znaków, jeśli nie znaleziono pasującego wpisu lub pracownika
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
  
  async refreshComponent() {
    const currentUrl = this.router.url;
    try {
      await this.router.navigateByUrl('/', { skipLocationChange: true });
      await this.router.navigate([currentUrl]);
    } catch (error) {
      console.error('Błąd podczas odświeżania komponentu:', error);
    }
  }
}
