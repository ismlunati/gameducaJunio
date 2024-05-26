import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Pregunta } from './model/Pregunta';
import { ReportePregunta } from './model/ReportePregunta';
import { Test } from './model/Test';



@Injectable({
  providedIn: 'root'
})
export class TestService {

  private baseUrl = 'http://localhost:8081/asignaturas';

  constructor(private http: HttpClient) { }



  getReportesPorAsignatura(idAsignatura: number): Observable<ReportePregunta[]> {

    const token = sessionStorage.getItem('token'); // Recupera el token desde donde lo tengas almacenado
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    
    return this.http.get<ReportePregunta[]>(`${this.baseUrl}/${idAsignatura}/reportePreguntas`, httpOptions); // Asegúrate de usar tu URL correcta
  }
    


  aceptarReporte(idAsignatura: number, idReporte:number): Observable<ReportePregunta> {

    const token = sessionStorage.getItem('token'); // Recupera el token desde donde lo tengas almacenado
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    
    return this.http.get<ReportePregunta>(`${this.baseUrl}/${idAsignatura}/reportePreguntas/${idReporte}/aceptar`, httpOptions); // Asegúrate de usar tu URL correcta
  }

  rechazarReporte(idAsignatura: number, idReporte:number): Observable<ReportePregunta> {

    const token = sessionStorage.getItem('token'); // Recupera el token desde donde lo tengas almacenado
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    
    return this.http.get<ReportePregunta>(`${this.baseUrl}/${idAsignatura}/reportePreguntas/${idReporte}/rechazar`, httpOptions); // Asegúrate de usar tu URL correcta
  }
    
    crearReportarPregunta(reportePregunta: ReportePregunta, idAsignatura: number, idTest: number, idPregunta: number): Observable<any> {
      
      const token = sessionStorage.getItem('token'); // Recupera el token desde donde lo tengas almacenado
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
        //params: new HttpParams().set('selectedPreguntaIds', selectedPreguntaIds)
      };

      console.log("reportarPregunta", reportePregunta);
      const url = `${this.baseUrl}/${idAsignatura}/test/${idTest}/reportarPregunta/${idPregunta}`;
      return this.http.post(url, reportePregunta, httpOptions);
    }





    crearPregunta(idAsignatura: number, idTema: number, formValue: any): Observable<Pregunta> {
      const token = sessionStorage.getItem('token'); // Recupera el token desde donde lo tengas almacenado
      
      // Verifica si el token existe
      if (!token) {
        throw new Error('No se encontró un token de autorización');
      }
  
      const { enunciado, respuestas, respuestaCorrecta } = formValue;
      const respuestasString = respuestas.join(',');
  
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
  
      const params = new HttpParams()
        .set('enunciado', enunciado)
        .set('respuestas', respuestasString)
        .set('respuestaCorrecta', respuestaCorrecta);
  
      const url = `${this.baseUrl}/${idAsignatura}/temas/${idTema}/crearPregunta`;
  
      return this.http.post<Pregunta>(url, {}, { headers, params });
    }


  createTest(testData: Test, selectedPreguntaIds: string, selectedTemasIds: string, idAsignatura:number): Observable<any> {
    testData.listaTemas=selectedTemasIds;
    console.log("test posteado", testData)
    const token = sessionStorage.getItem('token'); // Recupera el token desde donde lo tengas almacenado
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      //params: new HttpParams().set('selectedPreguntaIds', selectedPreguntaIds)
    };
    const fullUrl = `${this.baseUrl}/${idAsignatura}/crearTest?selectedPreguntaIds=${selectedPreguntaIds}`;

    return this.http.post<any>(fullUrl, testData, httpOptions); // Asegúrate de enviar los datos correctos en 'testData'
  }


  getElegiblePreguntas(listaTemas: string, idAsignatura:number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    console.log(`${this.baseUrl}/${idAsignatura}/test/preguntasElegibles?listaTemas=${listaTemas}`);
    return this.http.get<any>(`${this.baseUrl}/${idAsignatura}/test/preguntasElegibles?listaTemas=${listaTemas}`, httpOptions);
  }


  getTests(idAsignatura: number): Observable<any> {
    console.log("Test.Service: getTests");
    const token = sessionStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<any>(`${this.baseUrl}/${idAsignatura}/test`, httpOptions);
  }


  realizarTest(idRespuesta: number, idAsignatura: number, idTest: number, inicio: boolean): Observable<any> {
    console.log("Test.Service: realizarTest");
    const token = sessionStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      params: new HttpParams().set('inicio', inicio).set('idRespuesta', idRespuesta)
    };
    console.log('${this.baseUrl}/${idAsignatura}/test/${idTest}/realizarTest')
    console.log(inicio, idRespuesta);
    return this.http.get<any>(`${this.baseUrl}/${idAsignatura}/test/${idTest}/realizarTest`, httpOptions)
      .pipe(
        tap(data => {
          // Guardamos la pregunta obtenida en el servicio
          this.preguntaActual = data;
          console.log("pregunta actual", data)
        })
      );
  }

  getTestResultados(idAsignatura: number, idTest: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    // Construye la URL para obtener los resultados del test
    const url = `${this.baseUrl}/${idAsignatura}/test/${idTest}/resultadoTest`;

    // Realiza la solicitud GET y devuelve un Observable
    return this.http.get<any>(url, httpOptions);
  }

  // Variable para almacenar la pregunta
  private _preguntaActual: any;

  // Método setter para guardar la pregunta actual
  set preguntaActual(pregunta: any) {
    this._preguntaActual = pregunta;
  }

  // Método getter para recuperar la pregunta actual
  get preguntaActual(): any {
    return this._preguntaActual;
  }
}