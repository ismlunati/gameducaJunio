import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MotivoReportePregunta } from '../model/MotivoReportePregunta';
import { EstadoReportePregunta } from '../model/EstadoReportePregunta';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ReportePregunta } from '../model/ReportePregunta';
import { TestService } from '../test.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-reporte',
  templateUrl: './crear-reporte.component.html',
  styleUrls: ['../styles.css']
})
export class CrearReporteComponent implements OnInit {

  idAsignatura!:number;
  idTest!:number;
  idPregunta!:number;

  reporteForm: UntypedFormGroup;
  motivoOptions = Object.keys(MotivoReportePregunta);
  motivo!:MotivoReportePregunta;
  texto:string='';

  constructor(public dialogRef: MatDialogRef<CrearReporteComponent>, 
    private route: ActivatedRoute, 
    private fb: UntypedFormBuilder, 
    private testService:TestService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

    this.reporteForm = this.fb.group({
      texto: [''],
      motivo: ['']

    });
  }

  ngOnInit(): void {

    console.log("data", this.data)

    this.idAsignatura = +this.route.parent?.snapshot.paramMap.get('id')!;
    this.idTest = +this.route.snapshot.paramMap.get('idTest')!;
    this.idPregunta = +this.route.snapshot.paramMap.get('idPregunta')!;

    console.log("id this.idAsignatura", this.idAsignatura);
    console.log("id this.idTest", this.idTest);
    console.log("id this.idPregunta",this.idPregunta);

  }





  getMotivoValue(key: string): string {
    return MotivoReportePregunta[key as keyof typeof MotivoReportePregunta];
  }

  submitReport(): void {
    const reporte: ReportePregunta = {
      id: undefined, // Será definido por el backend
      texto: this.texto,
      motivo: this.motivo,
      estado: undefined, // Será definido por el backend o inicializado según tus necesidades
      pregunta: this.data.pregunta, // Asumiendo que pasaste la pregunta en data
      alumno: undefined // Asumiendo que pasaste el alumno en data
    };

    this.testService.crearReportarPregunta(reporte, this.idAsignatura, this.idTest, this.data.pregunta.id).subscribe(
      response => {

        console.log('Reporte enviado exitosamente', response);
        this.dialogRef.close(response);
        Swal.fire('Crear reporte', `Se ha reportado la pregunta con exito`, 'success');

      },
      error => {
        console.error('Error al enviar el reporte', error);
        Swal.fire('Reporte', `Ha ocurrido un error reportando la pregunta`, 'error');

      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
