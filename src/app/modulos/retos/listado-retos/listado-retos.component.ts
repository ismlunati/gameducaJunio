import { EstadoReto } from './../model/EstadoReto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignaturaService } from 'src/app/modulos//asignatura/asignatura.service';
import { AlumnoRetoDTO } from 'src/app/modulos/retos/model/AlumnoRetoDTO';
import { Reto } from 'src/app/modulos/retos/model/Reto';
import { AuthService } from 'src/app/modulos//usuario/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-retos',
  templateUrl: './listado-retos.component.html'
})
export class ListadoRetosComponent implements OnInit {

  id!: number;
  retos: Reto[] = [];
  retosUsuario: AlumnoRetoDTO[] = [];

  retosFiltrados: Reto[] = [];
  retosUsuarioFiltrados: AlumnoRetoDTO[] = [];
  estadoSeleccionado: EstadoReto = EstadoReto.COMPLETADO;


  listas: string[] = ['Lista retos', 'Retos inscritos'];  // Opciones para el select
  listaSeleccionada: string = 'Lista retos';

  public estados = Object.keys(EstadoReto);



  constructor(private route: ActivatedRoute, private asignaturaService: AsignaturaService,
    private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.id = +this.route.snapshot.parent?.paramMap.get('id')!;
    this.getRetosPorAsignatura();
    this.getRetosPorAlumnoAsignatura();

    if(this.esProfesor()){
      this.listas=['Lista retos', 'Retos de alumnos'];
    }


  }


  recargarListaRetos(): void {
    console.log('Recargando lista de retos...');
    this.getRetosPorAlumnoAsignatura();
    
  }


  getEstadoValor(estadoKey: string): string | null {
    if (estadoKey in EstadoReto) {
      return EstadoReto[estadoKey as keyof typeof EstadoReto];
    }
    return null;
  }


  getRetosPorAsignatura() {

    this.asignaturaService.getRetosPorAsignatura(this.id).subscribe(retos => {
      this.retos = retos;
      this.retosFiltrados = retos;
      console.log("retos por asignatura", retos);

    });
  }


  getRetosPorAlumnoAsignatura() {

    this.asignaturaService.getRetosPorAsignaturaUsuario(this.id).subscribe(retos => {
      this.retosUsuario = retos;
      console.log("Retos Usuario", this.retosUsuario);

      this.onSelectChange();//Filtra por el estado actual seleccionado 


      //console.log("Estoy imprimiendo el valor de alumno", this.alumno);
    });
  }


  onSelectChange() {


    this.retosUsuarioFiltrados = this.retosUsuario
      .map(alumnoReto => {
        const retoConEstadoFiltrados = alumnoReto.retoConEstado.filter(re => re.estado === this.estadoSeleccionado);

        // Si hay retoConEstado que coinciden, construir el objeto AlumnoRetoDTO explícitamente
        if (retoConEstadoFiltrados.length > 0) {
          return {
            alumno: alumnoReto.alumno,
            retoConEstado: retoConEstadoFiltrados
          };
        } else {
          return null;
        }
      })
      .filter(alumnoReto => alumnoReto !== null) as AlumnoRetoDTO[];

    console.log("retos filtrados1", this.retosUsuarioFiltrados);
    console.log("retos sinn filtrados1", this.retosUsuario);


  }


  onSelectListChange(){
    if(this.listaSeleccionada!=='Tienda'){
      this.onSelectChange();
    }

  }

  navegar(id: number) {
    this.router.navigate(['/asignaturas', this.id, 'retos', id, 'editar']);
  }



  borrarReto(reto: Reto): void {
    this.asignaturaService.borrarReto(reto.id, this.id).subscribe(
      res => {
        console.log('Asignatura borrada exitosamente');
        this.getRetosPorAsignatura();
        Swal.fire('Borrar', `Se ha borrado el reto ${reto.nombre} con exito`, 'success');

        // Actualiza tu vista o haz algo tras la eliminación de la asignatura
      },
      err => {
        Swal.fire('Borrar', `Ha ocurrido un error borrando el reto ${reto.nombre}`, 'error');
        console.error('Error borrando la asignatura', err);
      }
    );
  }


  unirseReto(idReto: number, nombreReto: String): void {
    this.asignaturaService.unirseReto(this.id, idReto).subscribe(
      res => {
        console.log('Unido a reto exitosamente');
        Swal.fire('Inscripcion', `Se ha realizado la inscripción al reto ${nombreReto} con exito`, 'success');
        // Actualiza tu vista o haz algo tras la eliminación de la asignatura
      },
      err => {
        Swal.fire('Inscripcion', `No se ha podido realizar la inscripción al reto "${nombreReto}" con exito`, 'error');
        console.error('Error uniendose a reto', err);
      }
    );
  }


  esProfesor(): boolean {

    if (this.authService.getUserFromSessionStorage()?.roles[0].rolNombre == 'ROLE_ADMIN') {
      return true;
    } else {

      return false;
    }
  }





  getEstadoReto(estadoKey: string): string | null {
    if (estadoKey in EstadoReto) {
      return EstadoReto[estadoKey as keyof typeof EstadoReto];
    }
    return null;
  }
}
