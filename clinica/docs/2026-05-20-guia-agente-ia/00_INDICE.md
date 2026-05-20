# Portal Clinica - Guia de continuidad para agente IA

Fecha: 2026-05-20  
Ruta base analizada: `/opt/apps/medico-portal`  
Objetivo: dejar una guia accionable para que otro agente IA termine el modulo Clinica con el menor margen de interpretacion posible.

## Documentos

1. `01_ESTADO_REAL.md`  
   Estado actual verificado, comandos ejecutados, resultados y riesgos.

2. `02_ARQUITECTURA_Y_MAPA.md`  
   Modulos, entry points, rutas principales y contratos de alto nivel.

3. `03_REQUERIMIENTOS_FALTANTES.md`  
   Lo que falta para considerar el proyecto terminado por backend, web, movil, base de datos y despliegue.

4. `04_PLAN_DE_TRABAJO.md`  
   Secuencia recomendada de implementacion para un agente IA.

5. `05_VALIDACION_Y_DESPLIEGUE.md`  
   Comandos de validacion, pruebas funcionales, despliegue y rollback.

6. `06_PROMPT_HANDOFF_AGENTE_IA.md`  
   Prompt listo para entregar a otro agente con contexto, restricciones y orden de ejecucion.

## Regla de lectura

Antes de tocar codigo, leer en este orden:

1. Este indice.
2. `01_ESTADO_REAL.md`.
3. `03_REQUERIMIENTOS_FALTANTES.md`.
4. `04_PLAN_DE_TRABAJO.md`.
5. Solo despues revisar codigo fuente.

## Regla operativa

No tomar como estado actual la documentacion vieja sin contrastarla. Los documentos previos del `2026-05-12` siguen siendo utiles como contexto, pero este paquete refleja el estado observado el `2026-05-20`.
