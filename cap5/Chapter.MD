# Capítulo 5: One-of-a-Kind Objects: the Singleton Pattern

# Singleton Pattern | Creacional

El Singleton asegura que exista una única instancia de una clase en toda la aplicación y proporciona un punto global de acceso a ella.

✅ Pros

- Control único de recursos compartidos (DB, logger, cache).

- Menos memoria: no se crean múltiples instancias innecesarias.

- Fácil acceso: cualquier parte del sistema puede usarlo sin pasarlo como dependencia.

- Consistencia global: todos usan el mismo estado.

❌ Contras

- Acoplamiento oculto: partes del código dependen del mismo estado global.

- Difícil de testear: los tests pueden contaminarse si la instancia mantiene estado.

- Violación de SRP: a veces combina demasiadas responsabilidades.

- Riesgo de abuso: se usa como “atajo” en lugar de aplicar inyección de dependencias.

### Ejemplos empresariales + Pasos de implementación
#### 1. Gestor de configuración (config service en empresa SaaS)

Problema: múltiples microservicios necesitan leer la misma configuración (APIs, endpoints, tokens).

Pasos:

- Crear clase ConfigManager que cargue la configuración al iniciar.

- Definir punto global de acceso único (singleton).

- Asegurar que el resto de servicios usen ConfigManager.getInstance().

- Prevenir duplicados cargando config solo una vez.

#### 2. Logger centralizado

Problema: distintos módulos generan logs (errores, auditoría). Se necesita consistencia en formato y destino.

Pasos:

- Crear clase Logger que maneje salida a archivo/DB/monitoring.

- Exponer única instancia compartida.

- Asegurar thread-safety si hay concurrencia.

- Usar Logger.getInstance().log(...) en todos los módulos.

#### 3. Pool de conexiones a base de datos

Problema: se debe evitar que cada servicio cree conexiones ilimitadas.

Pasos:

- Crear clase DBConnectionPool que administre las conexiones.

- Limitar la cantidad máxima de conexiones en la instancia única.

- Proveer métodos getConnection() / releaseConnection().

- Asegurar que toda la app use esa instancia única para interactuar con DB.

4. Gestión de cache en sistema financiero

Problema: varias operaciones requieren acceso a datos rápidos (ej. tasas de cambio, catálogos).

Pasos:

- Crear clase CacheService que maneje almacenamiento en memoria.

- Implementar política de expiración de datos.

- Garantizar única instancia para evitar duplicados inconsistentes.

- Consultar el cache antes de acceder a DB o API externa.

#### 5. Control de sesiones de usuario en aplicación web

Problema: en un portal empresarial, se necesita un servicio único que gestione las sesiones activas.

Pasos:

- Crear clase SessionManager que registre usuarios activos.

- Implementar métodos para crear, validar y destruir sesiones.

- Mantener la instancia única durante todo el ciclo de la app.

- Asegurar acceso concurrente seguro para múltiples usuarios.

> ### 📌 Regla de oro:
>
>El Singleton no es un martillo para todo. Úsalo solo cuando exista un recurso único y centralizado en la empresa (config, cache, logger, pool de conexiones).