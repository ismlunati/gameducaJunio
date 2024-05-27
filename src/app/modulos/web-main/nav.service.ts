import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Perfil } from './model/perfil.model';
import { Imagen } from './model/imagen.model';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  private urlApi='http://localhost:8081/asignaturas';

  private readonly ASIGNATURA_KEY = 'currentSubject';
  private menuAsignatura: BehaviorSubject<string>;
  currentSubject: Observable<string>;

  constructor(private http: HttpClient) {
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



  getPerfil(idAsignatura: number): Observable<Perfil> {

    const token = sessionStorage.getItem('token'); 
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<Perfil>(`${this.urlApi}/${idAsignatura}/perfil`, httpOptions);
  }


  editarPerfil(idAsignatura: number, nombreReal: string, nombreVisible: string, imagen:Imagen): Observable<any> {
    
    const token = sessionStorage.getItem('token'); 
    const params = {
      nombreReal: nombreReal,
      nombreVisible: nombreVisible
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`

    });
    return this.http.put(`${this.urlApi}/${idAsignatura}/perfil/editarPerfil`, imagen, { params, headers });
  }

}
