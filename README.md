# 📦 ReservApp - Gestión de Usuarios con Roles

**ReservApp** es una plataforma de gestión de reservas que incluye un sistema robusto de control de usuarios con autenticación y autorización basada en roles. Este módulo representa la base del backend de la aplicación, construido con **Spring Boot** y enfocado en la seguridad y escalabilidad.

---

## 🔐 Seguridad y Manejo de Roles

Se implementó control de acceso a los endpoints utilizando **Spring Security** con `@PreAuthorize`. Las contraseñas están encriptadas con `BCryptPasswordEncoder` para mayor seguridad.

### Roles definidos

- `ADMIN` – Acceso completo a todos los endpoints.
- `CUSTOMER` – Usuario cliente, acceso limitado a funcionalidades de reserva.
- `PROVIDER` – Usuario proveedor, acceso a sus propios recursos.

---

## 📲 Endpoints y Permisos

| Endpoint                                 | Método   | Rol permitido       | Descripción                                                  |
|------------------------------------------|----------|----------------------|--------------------------------------------------------------|
| `/auth/login`                                 | `POST`   | Público              | Iniciar sesión                                       |
| `/users`                                 | `POST`   | `ADMIN`              | Crear un nuevo usuario                                       |
| `/users/{userId}`                        | `PATCH`  | `ADMIN`              | Actualizar la información de un usuario                      |
| `/users`                                 | `GET`    | Público              | Endpoint de prueba (Hello World)                             |
| `/services`                              | `POST`   | `PROVIDER`           | Crear un nuevo servicio (verifica que el usuario sea proveedor) |
| `/services/{serviceId}`                  | `PATCH`  | `PROVIDER` (Dueño)   | Editar un servicio creado por el proveedor autenticado       |
| `/services/{serviceId}`                  | `DELETE` | `PROVIDER` (Dueño)   | Eliminar un servicio propio                                  |
| `/services/provider/{providerId}`        | `GET`    | `CUSTOMER` Público  | Obtener todos los servicios de un proveedor específico       |
| `/services`                              | `GET`    | `CUSTOMER` Público | Obtener todos los servicios disponibles                      |
| `/reservations`                       | `POST`    | `CUSTOMER`| Hacer una reserva a un servicio |
| `/reservations/me`                       | `GET`    | `CUSTOMER`| Ver las reservas hechas |                    |
| `/provider/reservations` | `GET` | `PROVIDER`| Obtiene las reservas del proveedor autenticado, opcionalmente filtradas por estado. |
| `/provider/reservations/{reservationId}/status` | `PUT`| `PROVIDER` |Actualiza el estado de una reserva específica de acuerdo con el ID de la reserva y el nuevo estado. 
| `/provider/services/{serviceId}/status` | `PUT` | `ADMIN`| Actualiza el estado de un servicio específico vinculado al proveedor autenticado. |




Los accesos están protegidos con anotaciones como:

```java
@PreAuthorize("hasRole('ADMIN')")
```

---

## 🔧 Funcionalidades implementadas

- ✅ Registro de usuarios  
- ✅ Encriptación de contraseñas con `BCryptPasswordEncoder`  
- ✅ Carga de roles y autorización por endpoint  
- ✅ Actualización parcial de usuarios con validación    
- ✅ Módulo de reservas para `CUSTOMER` y `PROVIDER`
- ✅ Control de acceso personalizado por recurso  
- ✅ Login con JWT

---

## 📨 Confirmación via Gmail
![image](https://github.com/user-attachments/assets/6aa0020e-a019-4eb6-bdbb-9c611dc1fa03)
![image](https://github.com/user-attachments/assets/eca1bf63-440a-4085-97d5-e64502936888)


## 🧠 Consideraciones

- Las contraseñas están protegidas con `BCrypt`, por lo tanto deben ser validadas adecuadamente en login.  
- La autenticación actual se realiza por email.  

---

## 🛠️ Tecnologías usadas

- Java 21  
- Spring Boot 3  
- Spring Security  
- JPA / Hibernate  
- PostgreSQL / MySQL (configurable)  
- Lombok  

---

## 📌 Estado

- 🔧 En desarrollo activo  
- 📁 Repositorio modular y limpio  
- ✅ Listo para integración con frontend o pruebas en Postman  

---

