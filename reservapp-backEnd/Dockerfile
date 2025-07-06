# Usa la imagen base de OpenJDK 21 en versión slim
FROM openjdk:21-jdk-slim

# Define el archivo JAR a copiar como argumento
ARG JAR_FILE=target/reservapp-0.0.1.jar

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo JAR al contenedor y lo renombra
COPY ${JAR_FILE} reservapp.jar

# Expone el puerto 8080 para la aplicación
EXPOSE 8080

# Crea un usuario sin contraseña para ejecutar la app
RUN adduser --disabled-password --gecos '' appuser

# Cambia al usuario creado
USER appuser

# Define el comando de entrada para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "reservapp.jar"]