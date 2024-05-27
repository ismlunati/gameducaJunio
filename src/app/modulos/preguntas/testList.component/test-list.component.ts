import { TestService } from './../test.service';
import { Pregunta } from '../model/Pregunta';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../usuario/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['../styles.css']
})
export class TestListComponent implements OnInit {

  tests: any[] = [];
  pregunta!: Pregunta;

  idAsignatura!: number;

  constructor(private testService: TestService, private router: Router, private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {

    this.idAsignatura = +this.route.snapshot.parent?.paramMap.get('id')!;

    console.log("Test-List.Component: ngOnInit");
    this.recargarTest();
  }

  recargarTest() {
    this.testService.getTests(this.idAsignatura).subscribe(data => {
      this.tests = data;
      console.log("Test", this.tests)
    });
  }

  realizarTest(testId: number) {
    console.log("Test-List.Component: realizarTest");
    this.testService.realizarTest(0, this.idAsignatura, testId, true).subscribe(
      response => {
        console.log("Res de realziarTEST")
        this.pregunta = this.testService.preguntaActual;
        if (this.pregunta.id === -1) {
          console.log("FIIIIIIIIIIIIIIIIIIIN");
        } else {
          console.log("Test-List.Component: respuesta -> Ir a test-pregunta");
          this.router.navigate(['/asignaturas', this.idAsignatura, 'test', 'test-pregunta', testId]);

        }
      },
      error => {
        console.error("Ha ocurrido un error", error);
      }
    );
  }


  cambiarVisibilidad(testId: number) {
    console.log("Test-List.Component: realizarTest");
    this.testService.cambiarVisibilidad(this.idAsignatura, testId).subscribe(
      response => {
        console.log("cambio visibilidad", response)
        Swal.fire('Test', `Se ha cambiado la visibilidad del test con exito`, 'success');
        this.recargarTest();
      },
      error => {
        console.error("Ha ocurrido un error", error);
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
}
