# **UTN-DS25-Grupo6**

Sistema de Gestión de Turnos para Lubricentro Renault

## **Miembros del Equipo:**


Nombre completo: Pedro Moyano

Legajo: 31411

Alias Slack: Pedro Moyano

Perfil Git: https://github.com/moyanop

---

Nombre completo: Franco Javier Portillo Colinas

Legajo: 31089

Alias Slack: Franco Portillo

Perfil Git: https://github.com/FrancoPortillo

---

Nombre completo: Axel Agustin Gonzalez Blasco

Legajo: 31303

Alias Slack: Agustin Gonzalez Blasco

Perfil Git: https://github.com/Agusgb

---

Nombre completo: Kaufman Martin Javier

Legajo: 32536

Alias Slack: Martín Kaufman

Perfil Git: https://github.com/MartinJK1

---

Nombre completo: Kaufman Sebastian Leonel

Legajo: 30616

Alias Slack: Sebastian Kaufman

Perfil Git: https://github.com/S-kfmN


---
Nombre completo: Elias Caracas

Legajo: 

Alias Slack: 

Perfil Git:

# **DOCUMENTACION DEL PROYECTO**
1. **Información General**
   Nombre del Proyecto: Sistema de Gestión de Turnos para Lubricentro Renault
   Grupo 6: Gonzalez Blasco, Agustin – Portillo Franco – Moyano Amaya Pedro –
   Kaufman, Martin – Kaufman Sebastian – Caracas Elias
   Fecha: 10/04/25
   Versión: v1.0

2. **Resumen Ejecutivo**
   El proyecto consiste en el desarrollo de una plataforma digital que permita a los clientes
   de un lubricentro Renault reservar turnos de manera online, según la disponibilidad,
   modelo de vehículo y tipo de servicio requerido. El sistema también permitirá al
   administrador organizar los horarios y mantener un historial completo de mantenimiento
   de cada vehículo.

3. **Oportunidad de Negocio** 

   - Problema que se resuelve:
   
   Actualmente, la gestión de turnos en el lubricentro se realiza a través de llamadas 
telefónicas o agendas manuales, lo que provoca errores en la asignación de horarios, 
pérdida de información sobre mantenimientos anteriores y una alta carga administrativa. 
Además, no se conserva un historial accesible y completo de los servicios realizados a 
cada vehículo, ni se automatizan los recordatorios de las citas. 

   - Impacto del problema:

   Los clientes deben llamar o acercarse para pedir un turno, lo que genera demoras,
confusión y mala experiencia de usuario.
El personal administrativo dedica gran parte del tiempo a coordinar turnos
manualmente, lo cual reduce la eficiencia.
Los mecánicos no cuentan con un historial previo para preparar adecuadamente los trabajos.
El dueño del lubricentro sufre pérdidas de productividad, insatisfacción del cliente y
menor capacidad de atención organizada.

   - Soluciones actuales y sus limitaciones:

   Actualmente, algunas herramientas como agendas digitales o llamadas telefónicas
permiten organizar turnos de forma básica. Sin embargo, estas soluciones no están
adaptadas a las necesidades específicas del lubricentro: no permiten registrar el
historial de mantenimiento de cada vehículo, no automatizan el envío de recordatorios a
los clientes, ni gestionan la disponibilidad en tiempo real según tipo de servicio, duración
estimada o modelo del auto. Esto limita la eficiencia del proceso y genera una mayor
carga operativa.

4. **Visión del Producto**

   - Descripción general:
   
   El producto es una plataforma web de gestión de turnos y mantenimiento diseñada para
   el lubricentro de vehículos Renault. El cual permite a los clientes reservar citas online
   seleccionando el tipo de servicio y el modelo del vehículo, mientras que el personal
   puede gestionar la disponibilidad del taller y consultar el historial completo de cada
   unidad atendida.

   - Propuesta de valor:

   Ofrece una solución ágil, especializada y accesible que mejora la atención al cliente,
reduce la carga administrativa y evita errores humanos. La plataforma está
personalizada al contexto operativo del lubricentro Renault, con servicios predefinidos,
gestión de horarios optimizada y seguimiento detallado por vehículo. Además, mejora la
comunicación mediante notificaciones automáticas y trazabilidad de los servicios
realizados, beneficiando la organización interna del taller y la experiencia de usuario.

   - Usuarios principales:  
 Clientes del lubricentro, personal administrativo, y mecánicos encargados de los servicios.

5. **Objetivos del Proyecto**


   - Objetivo principal:  
 
   Desarrollar un sistema integral que permita la gestión eficiente y digitalizada de turnos y
mantenimientos en un lubricentro Renault.

   - Objetivos específicos:

   Permitir a los clientes reservar turnos en línea.
Gestionar disponibilidad según horarios, tipo de servicio y modelo de vehículo.
Notificar automáticamente a los clientes sobre sus citas.
Llevar un historial detallado por vehículo.
Ofrecer una interfaz intuitiva para usuarios y administradores.

   - Métricas de éxito:

   Reducción de llamadas para reservar turnos en un 80%.
Al menos un 90% de los clientes utilizan el sistema online.
Aumento en la puntualidad y cumplimiento de turnos.
Mejora en la satisfacción del cliente según encuestas internas

6. **Alcance del Producto**

   - Dentro del Alcance:

   Registro de usuarios y vehículos.
Reserva de turnos en función de horarios y tipo de servicio.
Gestión de disponibilidad por parte del administrador.
Notificaciones automáticas por correo electrónico.
Historial de mantenimiento por vehículo.
Panel de control para el personal del lubricentro

   - Fuera del Alcance:

   Aplicación móvil (solo versión web en esta fase).
Integración con sistemas externos de facturación.
Registro de pagos en línea.
Reportes analíticos avanzados.

7. **Supuestos y Restricciones**

   - Supuestos:

   Los clientes cuentan con acceso a internet.
El personal del lubricentro está capacitado para usar el sistema.
Restricciones:
Tiempo de desarrollo limitado a 7 meses.
Presupuesto acotado.
Infraestructura del servidor limitada a recursos internos.

8. **Stakeholders Clave**

   Cliente/Patrocinador:
   
   Dueño del Lubricentro Renault.
   
   Usuarios finales:  
   
   Clientes: acceden desde la web para agendar turnos, consultar disponibilidad y recibir recordatorios.
   
   Personal administrativo: gestionan horarios, y acceden al historial de vehículos.
   
   Mecánicos: consultan el tipo de servicio requerido y el historial técnico del vehículo a intervenir.
   
   Otros interesados: Técnicos/mecánicos, proveedores de servicios TI.

9. **Riesgos Iniciales (Tabla)**

| Riesgo                                   | Probabilidad | Impacto | Estrategia de Mitigación                                 |
| ---------------------------------------- | ------------ | ------- | -------------------------------------------------------- |
| Falta de adopción por parte del personal | Media        | Alta    | Capacitación inicial y soporte durante el uso.           |
| Fallos en el servidor o hosting          | Baja         | Alta    | Uso de servidores confiables y backups frecuentes.       |
| Cambios en requerimientos                | Alta         | Medio   | Reuniones regulares con el cliente para validar avances. |
