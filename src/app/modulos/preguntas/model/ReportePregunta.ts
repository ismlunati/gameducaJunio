import { Alumno } from "../../usuario/model/Alumno";
import { EstadoReportePregunta } from "./EstadoReportePregunta";
import { MotivoReportePregunta } from "./MotivoReportePregunta";
import { Pregunta } from "./Pregunta";

export interface ReportePregunta {
    id: number |undefined;
    texto: string;
    motivo: MotivoReportePregunta;
    estado: EstadoReportePregunta |undefined;
    pregunta: Pregunta|undefined;
    alumno: Alumno|undefined ;


  }
  
  