# Todo — Mobile App

Aplicación móvil de gestión de tareas (principalmente académicas) construida con React Native y Expo. Permite a estudiantes organizar sus listas de tareas, dar seguimiento al progreso por materia y visualizar sus pendientes del día.
Permite:

- Crear y gestionar **listas de tareas** por materia o módulo con color e ícono personalizados
- Agregar, editar y eliminar **tareas** con prioridad, descripción y fecha de entrega
- Ver el **progreso** de cada lista con barra de avance
- Consultar las tareas con **vencimiento hoy** directamente en el home
- **Buscar** listas y tareas de forma dinámica
- Autenticarse con **Firebase** y mantener la sesión activa

---

## Tecnologías utilizadas

| Categoría          | Tecnología                           |
| ------------------ | ------------------------------------ |
| Framework          | React Native + Expo SDK 54           |
| Routing            | Expo Router                          |
| Lenguaje           | TypeScript                           |
| HTTP Client        | Axios                                |
| Autenticación      | Firebase Authentication              |
| Persistencia local | AsyncStorage                         |
| Estilos            | React Native StyleSheet + Tailwind   |
| UI Components      | Gluestack UI                         |
| Íconos             | `@expo/vector-icons` (MaterialIcons) |
| Backend            | Quarkus (Java) — deployado en Render |
| Database           | PostgreSQL — deployado Supabase      |

---

## Instrucciones de instalación

### Requisitos previos

- Node.js 18 o superior
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go instalado en tu dispositivo físico **o** un emulador Android/iOS configurado

### Pasos

````bash
# 1. Clona el repositorio
git clone <https://github.com/FeryRi/Todo-app.git>

# 2. Entra a la carpeta del proyecto móvil
cd todofront-mobile/todo-mobile

# 3. Instala las dependencias
npm install

# 4. agrega el .env en la raíz del proyecto

# URL del backend REST
EXPO_PUBLIC_API_URL=https://todoback-xkpn.onrender.com


## Cómo ejecutar el proyecto

```bash
# Iniciar el servidor de desarrollo (muestra QR para Expo Go)
npm start

# Abrir directamente en emulador Android
npm run android

# Abrir directamente en simulador iOS (solo macOS)
npm run ios

# Abrir en navegador web
npm run web
````

Escanea el código QR con **Expo Go** (Android/iOS) para ver la app en tu dispositivo físico.

> **Advertencia:** El backend está desplegado en el plan gratuito de Render, por lo que puede tardar entre 30 y 50 segundos en responder la primera vez (cold start). La app maneja esto con reintentos automáticos y mensajes de espera.

---

## Links deployados

| Servicio                       | URL                                |
| ------------------------------ | ---------------------------------- |
| Backend API (Quarkus / Render) | https://todoback-xkpn.onrender.com |

### Endpoints principales del backend

| Método   | Ruta                 | Descripción                                |
| -------- | -------------------- | ------------------------------------------ |
| `GET`    | `/dashboard`         | Home — listas con progreso + tareas de hoy |
| `GET`    | `/lists`             | Todas las listas del usuario               |
| `POST`   | `/lists`             | Crear lista                                |
| `GET`    | `/lists/{id}`        | Detalle de lista con tareas                |
| `PUT`    | `/lists/{id}`        | Editar lista                               |
| `DELETE` | `/lists/{id}`        | Eliminar lista                             |
| `POST`   | `/tasks`             | Crear tarea                                |
| `PUT`    | `/tasks/{id}`        | Editar tarea                               |
| `PATCH`  | `/tasks/{id}/status` | Cambiar estado de tarea                    |
| `DELETE` | `/tasks/{id}`        | Eliminar tarea                             |
| `GET`    | `/search?q=`         | Buscar listas y tareas                     |

---

## Usuarios de prueba

| Rol               | Correo          | Contraseña |
| ----------------- | --------------- | ---------- |
| Usuario de prueba | `1@hotmail.com` | `aA123456` |

> Si el usuario anteriores no existen, puedes crear una cuenta nueva desde la pantalla de **Registro** dentro de la app.

---

## Estructura del proyecto

```
todo-mobile/
├── app/                    # Pantallas (Expo Router)
│   ├── (tabs)/
│   │   ├── index.tsx       # Home / Dashboard
│   │   ├── search.tsx      # Búsqueda
│   │   └── about.tsx       # About
│   ├── lists/[id].tsx      # Detalle de lista
│   ├── login.tsx
│   └── register.tsx
├── components/             # Componentes reutilizables
│   ├── TaskListCard/       # Tarjeta de lista con progreso
│   ├── TaskRow/            # Fila de tarea con checkbox
│   ├── TaskFormModal/      # Modal crear/editar tarea (discriminado por prop `task`)
│   ├── EditListModal/      # Modal editar lista
│   ├── CreateListModal/    # Modal crear lista
│   ├── DeleteConfirmModal/ # Modal confirmación de eliminación
│   └── DatePickerField/    # Selector de fecha nativo
├── services/               # Capa de acceso a la API
│   ├── api.ts              # Instancia Axios + interceptors
│   ├── auth/               # Firebase auth
│   ├── lists/              # CRUD de listas
│   ├── tasks/              # CRUD de tareas
│   └── search/             # Búsqueda
├── types/                  # Tipos TypeScript
│   ├── Task.ts
│   └── TaskList.ts
└── assets/                 # Imágenes e íconos
```
