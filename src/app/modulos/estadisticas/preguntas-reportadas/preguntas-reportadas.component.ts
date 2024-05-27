import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../estadisticas.service';
import { ActivatedRoute } from '@angular/router';
import { EstadisticasReportesAlumnosDTO } from '../model/EstadisticasReportesAlumnosDTO';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { InformacionEnum } from '../model/InformacionEnum';

@Component({
  selector: 'app-preguntas-reportadas',
  templateUrl: './preguntas-reportadas.component.html',
  styleUrls: ['../styles.css']


})
export class PreguntasReportadasComponent implements OnInit {

  reportesAlumnos!: EstadisticasReportesAlumnosDTO[];

  idAsignatura!: number;
  constructor(private estadisticaService: EstadisticasService, private route: ActivatedRoute, private dialog:MatDialog) {

  }

  ngOnInit(): void {

    this.idAsignatura = +this.route.snapshot.parent?.paramMap.get('id')!;

    this.estadisticaService.getEstadisticasReportesAlumnos(this.idAsignatura, "preguntasReportadas").subscribe(reportes => {
      this.reportesAlumnos = reportes;

    })

  }


  openInfoDialog() {
    this.dialog.open(InfoDialogComponent, {
      data: {
        message: InformacionEnum.PreguntasReportadas
      }
    });
  }

}