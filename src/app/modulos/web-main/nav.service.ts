import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {


  private readonly ASIGNATURA_KEY = 'currentSubject';
  private menuAsignatura: BehaviorSubject<string>;
  currentSubject: Observable<string>;

  constructor() {
    const storedSubject = sessionStorage.getItem(this.ASIGNATURA_KEY);
    this.menuAsignatura = new BehaviorSubject<string>(storedSubject ? storedSubject : '');
    this.currentSubject = this.menuAsignatura.asObservable();
  }

  getCurrentSubject(): Observable<string> {
    console.log("valor de la variable observable", this.menuAsignatura.getValue() )
    return this.menuAsignatura.asObservable();
  }

  setSubject(subject: string) {
    this.menuAsignatura.next(subject);
    sessionStorage.setItem(this.ASIGNATURA_KEY, subject);
    console.log("Asignatura seteada:", subject);
  }

}
