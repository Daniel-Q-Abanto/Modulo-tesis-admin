import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Usuario from './components/usuarios/Usuario';
import HistorialIA from './components/historial_ia/HistorialIA';
import RolPermiso from './components/roles_y_permisos/RolPermiso';
import EditarRolPermiso from './components/roles_y_permisos/EditarRolPermiso';
import AgregarRolPermiso from './components/roles_y_permisos/AgregarRolPermiso';
import EliminarRolPermiso from './components/roles_y_permisos/EliminarRolPermiso';
import Login from './components/admin/Login';
import RegisterSuperUser from "./components/admin/RegisterSuperUser";
import PrivateRoute from './components/admin/PrivateRoute';
import PublicRoute from './components/admin/PublicRoute';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/admin/ProtectedRoute';
import authService from './services/authService';
import { useEffect } from 'react';
import AgregarUsuario from './components/usuarios/AgregarUsuario';
import EditarUsuario from './components/usuarios/EditarUsuario';
import EliminarUsuario from './components/usuarios/EliminarUsuario';
import EliminarHistorialIA from './components/historial_ia/EliminarHistorialIA'



function App() {
  const drawerWidth = 240;

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<ProtectedRoute><Login /></ProtectedRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterSuperUser /></PublicRoute>} />

        {/* Rutas privadas */}
        <Route 
          path="/*" 
          element={
            <PrivateRoute>
              <NavBar drawerWidth={drawerWidth}>
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="usuarios" element={<Usuario />} />
                  <Route path="historiales" element={<HistorialIA />} />
                  <Route path="roles" element={<RolPermiso />} />

                  <Route path="agregar-usuario" element={<AgregarUsuario />} />
                  <Route path="agregar-rol" element={<AgregarRolPermiso />} />



                  <Route path="editar-usuario/:id" element={<EditarUsuario />} />
                  <Route path="editar-rol/:id" element={<EditarRolPermiso />} />


                  <Route path="eliminar-usuario/:id" element={<EliminarUsuario />} />
                  <Route path="eliminar-historial/:id" element={<EliminarHistorialIA />} />
                  <Route path="eliminar-rol/:id" element={<EliminarRolPermiso />} />
                  
                </Routes>
              </NavBar>
            </PrivateRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
