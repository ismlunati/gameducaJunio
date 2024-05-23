import { Logro } from "../../logros/model/Logro";
import { AlumnoReto } from "./AlumnoReto";

export interface Reto {
    id:number;
    nombre:string;
    descripcion:string;
    puntosOtorgados:number;
    temporal:boolean;
    fechaInicio: Date;
    fechaFin: Date;
    logro:Logro;
    alumnoRetos:AlumnoReto[];

}
