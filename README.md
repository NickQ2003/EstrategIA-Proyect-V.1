# SIPREL - Sistema de Registro de Participantes

Sistema web moderno para gestión de participantes y control de asistencia con escaneo de códigos de barras.

## 📁 Estructura del Proyecto

```
siprel/
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── styles/        # Estilos organizados
│   │   │   ├── index.css         # Estilos globales y utilidades
│   │   │   ├── variables.css     # Variables CSS
│   │   │   └── modules/          # CSS Modules por componente
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── backend/               # API Django REST Framework
    ├── api/
    ├── siprel_backend/
    ├── manage.py
    └── requirements.txt
```

## 🚀 Inicio Rápido

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5174`

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

El backend estará disponible en `http://localhost:8000`

## 🎨 Organización de CSS

### Estilos Globales
- `frontend/src/styles/index.css` - Punto de entrada principal
- `frontend/src/styles/variables.css` - Variables CSS (colores, espaciado, etc.)

### CSS Modules
Cada componente tiene su propio CSS Module en `frontend/src/styles/modules/`:
- `Layout.module.css`
- `Dashboard.module.css`
- `Participants.module.css`
- `Attendance.module.css`
- `Login.module.css`
- `CustomSelect.module.css`

**Ventajas:**
- ✅ Scope local automático (sin conflictos de nombres)
- ✅ Tree-shaking en producción
- ✅ Fácil mantenimiento
- ✅ Organización clara

## 🛠️ Tecnologías

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool
- **React Router** - Navegación
- **Lucide React** - Iconos
- **XLSX** - Exportación a Excel

### Backend
- **Django 4.2** - Framework web
- **Django REST Framework** - API REST
- **SQLite** - Base de datos (desarrollo)

## 📦 Scripts Disponibles

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build

### Backend
- `python manage.py runserver` - Servidor de desarrollo
- `python manage.py migrate` - Aplicar migraciones
- `python manage.py createsuperuser` - Crear usuario admin

## 🔐 Roles de Usuario

- **Admin** - Acceso completo
- **Supervisor** - Gestión de participantes y reportes
- **Digitador** - Registro de asistencia

## 📝 Características

- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión de participantes (CRUD completo)
- ✅ Control de asistencia
- ✅ Escaneo de códigos de barras (PDF417)
- ✅ Exportación a Excel
- ✅ Validación de formularios robusta
- ✅ Diseño responsive y moderno
- ✅ Filtros y búsqueda avanzada

## 🎯 Próximos Pasos

- [ ] Implementar gráficos en Dashboard
- [ ] Agregar autenticación JWT
- [ ] Configurar PostgreSQL para producción
- [ ] Implementar tests unitarios
- [ ] Dockerizar la aplicación

## 📄 Licencia

Este proyecto es privado y confidencial.
