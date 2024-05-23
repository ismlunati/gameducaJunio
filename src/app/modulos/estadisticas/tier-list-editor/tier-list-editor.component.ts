import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../estadisticas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaAlumnosAndTierListDTO } from '../model/ListaAlumnosAndTierListDTO';
import { AlumnosAndTiersDTO } from '../model/AlumnosAndTiersDTO';
import { TierList } from '../model/TierList';


@Component({
  selector: 'app-tier-list-editor',
  templateUrl: './tier-list-editor.component.html',
  styleUrls: ['../styles.css'],
  
})
export class TierListEditorComponent implements OnInit {
  tierListId!: number;
  alumnoTiers!: ListaAlumnosAndTierListDTO; 
  idAsignatura!:number;

  constructor(
    private estadisticaService: EstadisticasService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tierListId = this.route.snapshot.params['id'];

    this.idAsignatura = this.route.snapshot.parent?.params['id'];



    this.loadTierList(this.tierListId);
  }



  loadTierList(id: number): void {
    this.estadisticaService.getTier(this.idAsignatura, this.tierListId).subscribe(response => {
      this.alumnoTiers= response;
      console.log("alumno tiers", this.alumnoTiers);
    })
    // Obtén los datos de la TierList y llena el formulario y los tiers
  }


  trackByFn(index: number, item: any) {
    return item.id; // Devuelve propiedad 'id' única
  }



  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.cdr.detectChanges();
  }
  


  // Esta función transforma tu objeto tierList en el formato deseado
  transformarTierListATierDTO(tierList: TierList): AlumnosAndTiersDTO {
    const resultado: AlumnosAndTiersDTO = { tiers: {} };
    tierList.tiers.forEach(tier => {
      resultado.tiers[tier.id] = tier.alumnos.map(alumno => alumno.id);
    });
    return resultado;
  }



  onSave() {
    this.estadisticaService.postAlumnosATiers(this.idAsignatura, this.tierListId, this.transformarTierListATierDTO(this.alumnoTiers.tierList))
    .subscribe((tierCreada:TierList) => {      
      this.router.navigate(['/asignaturas', this.idAsignatura, 'estadisticas', 'verTierList']);
    });
  }


  goBack() {

      
      this.router.navigate(['/asignaturas', this.idAsignatura, 'estadisticas', 'verTierList']);

  
  }

}

