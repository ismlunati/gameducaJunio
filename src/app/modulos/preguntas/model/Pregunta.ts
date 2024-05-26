import { Alumno } from "../../usuario/model/Alumno";
import { Respuesta } from "./Respuesta";

export interface Pregunta {
  id: number;
  enunciado: string;
  respuestas: Respuesta[];
  alumno: any |undefined;
  // otros campos si es necesario
}

