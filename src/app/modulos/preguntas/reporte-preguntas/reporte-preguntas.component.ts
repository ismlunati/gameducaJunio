import { ReportePregunta } from '../model/ReportePregunta';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../test.service';
import { Respuesta } from '../model/Respuesta';
import { EstadoReportePregunta } from '../model/EstadoReportePregunta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-preguntas',
  templateUrl: './reporte-preguntas.component.html'

})
export class ReportePreguntasComponent implements OnInit {

  reportePreguntas: ReportePregunta[] = [];
  idAsignatura!: number;
  estadoEnviado: EstadoReportePregunta = EstadoReportePregunta.ENVIADO;



  constructor(private route: ActivatedRoute, private testService: TestService, private router: Router) {

  }

  ngOnInit(): void {

    this.idAsignatura = +this.route.parent?.snapshot.paramMap.get('id')!;


    this.recargarReportes();

  }

  getRespuestaCorrecta(respuestas: Respuesta[] | undefined): string {
    const respuestaCorrecta = respuestas?.find(respuesta => respuesta?.esCorrecta);
    return respuestaCorrecta ? respuestaCorrecta.texto : 'No disponible';
  }




  recargarReportes() {

    this.testService.getReportesPorAsignatura(this.idAsignatura).subscribe(reportePreguntas => {
      this.reportePreguntas = reportePreguntas;

      console.log("procedo a imprimir las reportes pregunta", reportePreguntas);
      //console.log("Estoy imprimiendo el valor de alumno", this.alumno);
    });
  }





  aceptarReporte(reporte: ReportePregunta): void {
    if (reporte.id !== undefined) {
      this.testService.aceptarReporte(this.idAsignatura, reporte.id).subscribe(response => {
        console.log('Reporte aceptado', response);
        // Actualiza el estado del reporte localmente o vuelve a cargar los reportes
        this.recargarReportes();
        Swal.fire('Reporte', `Se ha aceptado el reporte de la pregunta con éxito`, 'success');


      });
    }
  }

  rechazarReporte(reporte: ReportePregunta): void {
    if (reporte.id !== undefined) {

      this.testService.rechazarReporte(this.idAsignatura, reporte.id).subscribe(response => {
        console.log('Reporte rechazado', response);
        // Actualiza el estado del reporte localmente o vuelve a cargar los reportes
        this.recargarReportes();
        Swal.fire('Reporte', `Se ha rechazado el reporte de la pregunta con éxito`, 'success');


      });
    }
  }

}
