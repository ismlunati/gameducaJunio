import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../estadisticas.service';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { EstadisticasTestPorTestDTO } from '../model/EstadisticasTestPorTestDTO';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';


@Component({
  selector: 'app-test-por-test',
  templateUrl: './test-por-test.component.html',
  styleUrls: ['../styles.css'],
  animations: [
    trigger('fadeInStagger', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-50px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})


export class TestPorTestComponent implements OnInit {

  id!:number;

  testPorTest!:EstadisticasTestPorTestDTO[];


  constructor(private estadisticaService: EstadisticasService, private route: ActivatedRoute,
    private dialog: MatDialog
  ) { 
    
  }

  ngOnInit(): void {

    this.id= +this.route.snapshot.parent?.paramMap.get('id')!;


    this.estadisticaService.getEstadisticasTestPorTest(this.id).subscribe(estadisticas=> {
      
      console.log(estadisticas); 
       
       this.testPorTest= estadisticas;
       
     });
  }



  openInfoDialog() {
    this.dialog.open(InfoDialogComponent, {
      data: {
        message: 'Esta aplicación te permite gestionar tus tareas de manera eficiente. Puedes agregar, editar y eliminar tareas, así como asignarles prioridades y fechas límite.'
      }
    });
  }
}
