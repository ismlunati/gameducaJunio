import { Component, Input, OnInit } from '@angular/core';
import { Asignatura } from '../../model/asignatura';
import { AsignaturaService } from '../../asignatura.service';
import { Router } from '@angular/router';
import { NavService } from 'src/app/modulos/web-main/nav.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html'
})
export class ListadoComponent implements OnInit {

  asignaturas: Asignatura[] = [];

  @Input() alumno!: boolean;

  constructor(private asignaturaService: AsignaturaService, private router: Router, private navService: NavService) { }

  ngOnInit(): void {
    this.navService.setSubject('');
    this.asignaturaService.getAsignaturas().subscribe(asignaturas => {
      this.asignaturas = asignaturas;
      console.log("procedo a imprimir las asignaturas", this.asignaturas);
      //console.log("Estoy imprimiendo el valor de alumno", this.alumno);
    });

    console.log("esProfesor", this.alumno)
  }


  navegar(asignatura: Asignatura) {

    if (this.alumno) {
      console.log("alumno")
      this.asignaturaService.getAsignatura(asignatura.id).subscribe(res => {
        console.log("res")
        if (res.id) {
          this.router.navigate(['/asignaturas', asignatura.id]);
          this.navService.setSubject(asignatura.nombre);
        }else{
          Swal.fire('Acceso', `No se ha podido acceder a la asignatura ${asignatura.nombre} porque el profesor aún no ha aceptado la petición`, 'error');

        }

      })
    }
    else {
      console.log("profesor")
      this.router.navigate(['/asignaturas', asignatura.id]);
      this.navService.setSubject(asignatura.nombre);

    }
  }

  borrarAsignatura(idAsignatura: number): void {
    this.asignaturaService.borrarAsignatura(idAsignatura).subscribe(
      res => {
        console.log('Asignatura borrada exitosamente');
        this.asignaturas = this.asignaturas.filter(asignatura => asignatura.id !== idAsignatura);
        // Actualiza tu vista o haz algo tras la eliminación de la asignatura
      },
      err => {
        console.error('Error borrando la asignatura', err);
      }
    );
  }

}
