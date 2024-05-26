import { forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Artefacto } from 'src/app/modulos/artefactos/model/Artefacto';
import { AsignaturaService } from 'src/app/modulos//asignatura/asignatura.service';
import { ArtefactoLogro } from 'src/app/modulos/artefactos/model/ArtefactoLogro';
import { Logro } from 'src/app/modulos/logros/model/Logro';
import { AuthService } from 'src/app/modulos//usuario/auth.service';

@Component({
  selector: 'app-anadir-logros',
  templateUrl: './anadir-logros.component.html',
  styleUrl: '../logros.component.css'
})
export class AnadirLogrosComponent implements OnInit {

  logroForm: UntypedFormGroup;
 

  idAsignatura: number | null = null;
  crearEditar:string='Crear';
  idLogro: number | null = null;

  logro!: Logro;

  base64Image: string | undefined;
  selectedFile: File | null = null;

  artefactosAsignatura!: Artefacto[];

  constructor(private fb: UntypedFormBuilder, private asignaturaService: AsignaturaService,
    private route: ActivatedRoute, private authService: AuthService, private router: Router) {

    const isAlumno= !this.esProfesor();

    this.logroForm = this.fb.group({
      nombre: [{ value: '', disabled: isAlumno}, Validators.required],
      descripcion: [{ value: '', disabled: isAlumno}, Validators.required],
      artefactoLogros: this.fb.group({
        desbloquear: [{ value: false, disabled: true }],
        obtener: [{ value: false, disabled: true }],
        artefacto: new UntypedFormControl({ value: '', disabled: isAlumno})
      }),
    });


    // Asegurando a TypeScript que logroForm no es null utilizando un operador de aserción.
    (this.logroForm.get('artefactoLogros.artefacto') as UntypedFormControl).valueChanges.subscribe((artefacto) => {
      // También asegurando que los controles no son null.
      const desbloquearControl = this.logroForm.get('artefactoLogros.desbloquear') as UntypedFormControl;
      const obtenerControl = this.logroForm.get('artefactoLogros.obtener') as UntypedFormControl;
      if (artefacto && !isAlumno) {
        desbloquearControl.enable();
        obtenerControl.enable();
      } else {
        desbloquearControl.disable();
        obtenerControl.disable();
      }
    });

  }

  ngOnInit(): void {
    //this.route.snapshot.parent?.paramMap.get('id')

    this.idAsignatura = +this.route.snapshot.parent?.paramMap.get('id')!;
    this.idLogro = +this.route.snapshot?.paramMap.get('id')!;


    this.asignaturaService.getArtefactosPorAsignatura(this.idAsignatura).subscribe(artefactos => {
      this.artefactosAsignatura = artefactos;
    });
    
    // console.log("artefactos", this.artefactosAsignatura);

    if (this.idLogro !== 0) {
      // Aquí va la lógica si existe id

      this.crearEditar="Editar"
      
      forkJoin({
        logro: this.asignaturaService.getLogroPorId(this.idAsignatura, this.idLogro),
        artefactos:this.asignaturaService.getArtefactosPorAsignatura(this.idAsignatura)
      }).subscribe(({logro, artefactos})  =>{


        this.artefactosAsignatura = artefactos;
        this.logro = logro;

        this.base64Image=logro?.imagen;

        this.logroForm.patchValue({
          nombre: this.logro.nombre,
          descripcion: this.logro.descripcion,
          artefactoLogros: {
            desbloquear: this.logro?.artefactoLogros?.desbloquear,
            obtener: this.logro?.artefactoLogros?.obtener,
            artefacto: this.artefactosAsignatura.find(a=> a.id==this.logro.artefactoLogros.artefacto.id)?.id
            //artefacto: this.logro.artefactoLogros?.artefacto.id
          }

        });



      })


    } else {
      // Aquí va la lógica si no existe id

    }


  }




  metodoActualizarCrear(): void {
    if (this.idLogro !== 0) {
      this.actualizarLogro();

    } else {
      this.crearLogro()

    }

    this.router.navigate(['/asignaturas', this.idAsignatura, 'logros', 'listado']);
  }


  crearLogro(): void {

    const formValues = this.logroForm.value;

    console.log('formValues',formValues)
    const selectedArtefacto = this.artefactosAsignatura.find(artefacto => artefacto.id === +formValues.artefactoLogros.artefacto);


    let artefactoLogros: ArtefactoLogro | null = null; // asigna null como valor por defecto

    if (selectedArtefacto !== undefined) {
      artefactoLogros = {
        ...formValues.artefactoLogros // Esto copia los valores de desbloquear y obtener del formulario
      }
      console.log("artefactoLogro Form", artefactoLogros)

      artefactoLogros!.artefacto = selectedArtefacto;
    }

    const logroPost: Logro = {
      ...formValues,  // Esto copia los valores de nombre, descripcion, etc. del formulario
      artefactoLogros: artefactoLogros,
      imagen: this.base64Image
    };


    //en vez de mandar this.logroForm.value voy a mandar logro
    this.asignaturaService.crearLogro(logroPost, this.idAsignatura!)
      .subscribe((logro: Logro) => {
        console.log('logro creada', logro);
        // Aquí podrías redirigir al usuario, actualizar la lista de asignaturas, etc.
      });
  }




  actualizarLogro(): void {
    //Object.assign(this.logro, this.logroForm.value);

    const formValues = this.logroForm.value;
    const selectedArtefacto = this.artefactosAsignatura.find(artefacto => artefacto.id === +formValues.artefactoLogros.artefacto);

    let artefactoLogros: ArtefactoLogro | null = null; // asigna null como valor por defecto







    if (selectedArtefacto !== undefined) {
      artefactoLogros = {
        ...formValues.artefactoLogros // Esto copia los valores de desbloquear y obtener del formulario
      }
      artefactoLogros!.artefacto = selectedArtefacto;
    }

    const logroPost: Logro = {
      id: this.logro.id,
      ...formValues,  // Esto copia los valores de nombre, descripcion, etc. del formulario
      artefactoLogros: artefactoLogros,
      imagen: this.base64Image
    };





    this.asignaturaService.actualizarLogro(logroPost, this.idAsignatura!)
      .subscribe((logroCreado: Logro) => {
        console.log('Logro actualizado', logroCreado);
        // Aquí podrías redirigir al usuario, actualizar la lista de asignaturas, etc.
      });
  }

  esProfesor(): boolean {

    if (this.authService.getUserFromSessionStorage()?.roles[0].rolNombre == 'ROLE_ADMIN') {

      return true;
    } else {

      return false;
    }
  }



  getValidacionNombre():string{
    let resultado:string="";

    if(this.logroForm.get('nombre')?.errors?.required){
      resultado="Debe introducir un nombre del logro";     
    }
    return resultado;
  }

  getValidacionDescripcion():string{
    let resultado:string="";
    
    if(this.logroForm.get('descripcion')?.errors?.required){
      resultado="Debe introducir una descripcion del logro";
    }
    return resultado;
  }



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.base64Image = reader.result as string;
      };
    }
  }


  cambiarFotoLogro() {
    const input = document.getElementById('fotoLogro') as HTMLInputElement;
    input.click();
  }

}
