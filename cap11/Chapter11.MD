# Capítulo 11 Controlling Object Access: the Proxy Pattern

# Patrón Proxy | Estructural 

El Proxy es un objeto que actúa como intermediario o representante de otro objeto (el real subject). Controla el acceso, puede agregar lógica extra (cacheo, seguridad, diferir carga, logging) sin modificar la clase real.

### ✅ Pros

- Control de acceso y seguridad centralizada.
- Posibilita lazy loading (cargar recursos solo cuando se usan).
- Facilita el cacheo de resultados costosos.
- Permite agregar auditoría, logging o métricas sin tocar la lógica central.

### ❌ Contras

- Aumenta la complejidad y número de clases.
- Puede introducir overhead de rendimiento si no se diseña bien.
- Mal usado, genera capas innecesarias de indirectización.

##  Ejemplos Empresariales

### 1. Proxy de Imágenes en un catálogo e-commerce

**Qué resuelve:** carga diferida de imágenes pesadas en la web.

**Implementación**: el proxy muestra una miniatura o placeholder hasta que la imagen real es solicitada.

#### Cuándo usar / evitar:

**Usar:** cuando hay muchos recursos multimedia costosos.

**Evitar:** si las imágenes son ligeras o pocas.

**Recomendación:** ideal en apps de retail con miles de productos.

### 2. Proxy de Seguridad en sistemas corporativos

**Qué resuelve:** controla permisos antes de acceder a recursos críticos (ej: nómina de empleados).

**Implementación**: el proxy valida roles/permisos y decide si delegar al objeto real.

#### Cuándo usar / evitar:

**Usar:** si el sistema tiene múltiples roles y niveles de acceso.

**Evitar:** si la seguridad puede resolverse con una simple verificación en la capa de negocio.

**Recomendación:** excelente para apps de RRHH, banca o gobierno.

### 3. Proxy de Cache para consultas a bases de datos

**Qué resuelve:** evita consultas repetitivas y costosas a la base.

**Implementación**: el proxy guarda los resultados recientes y los devuelve sin llamar al objeto real.

#### Cuándo usar / evitar:

**Usar:** en entornos con alto volumen de lectura y datos poco cambiantes.

**Evitar:** si los datos cambian constantemente (cache puede quedar obsoleto rápido).

**Recomendación:** muy útil en dashboards y sistemas de reportes.

### 4. Proxy de Servicio Remoto (API Gateway)

**Qué resuelve:** representar y centralizar acceso a microservicios distribuidos.

**Implementación**: el proxy recibe la petición, agrega políticas (seguridad, logging) y luego llama al microservicio real.

#### Cuándo usar / evitar:

**Usar:** si manejas múltiples servicios con autenticación, monitoreo y rate limiting.

**Evitar:** si el sistema es monolítico y sin distribución.

**Recomendación:** esencial en arquitecturas cloud y microservicios.

### 5. Proxy de Auditoría en firmas digitales

**Qué resuelve:** registrar cada operación sensible en un sistema legal/financiero.

**Implementación**: el proxy envuelve las operaciones y guarda un log inmutable antes de ejecutar la acción real.

#### Cuándo usar / evitar:

**Usar:** en sectores regulados (banca, seguros, legal).

**Evitar:** si el sistema no tiene obligaciones regulatorias ni auditoría.

**Recomendación:** clave para cumplir compliance y normativas.

## Frase resumen

El patrón Proxy es como un “guardián con valor añadido”: protege, retrasa o mejora el acceso a un objeto real, evitando sobrecargas directas y aportando control y flexibilidad, pero solo conviene cuando el acceso al recurso realmente requiere regulación o costos diferidos.