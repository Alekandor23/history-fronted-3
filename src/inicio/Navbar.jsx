import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './Inicio.css';
import logo from '../assets/logo.jpeg'
import Buscador from "./Buscador";
import {getCategories, getBooksByCategory} from "../service/api";
import {getCountries, getBooksByCountry} from "../service/api";
import { useUser } from "../contexts/userContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const { user, setUser } = useUser();
  // Función para obtener las categorías
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data); // Almacena las categorías en el estado
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };
  // Abre el dropdown de categorías y carga las categorías si aún no están cargadas
  const handleCategoryClick = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    if (!categories.length) {
      fetchCategories();
    }
  };
  // Función para obtener los paises
  const fetchCountries = async () => {
    try {
      const response = await getCountries();
      setCountries(response.data); // Almacena las categorías en el estado
    } catch (error) {
      console.error("Error al obtener los paises:", error);
    }
  };
  // Abre el dropdown de categorías y carga las categorías si aún no están cargadas
  const handleCountryClick = () => {
    setIsCountryDropdownOpen(!isCountryDropdownOpen);
    if (!countries.length) {
      fetchCountries();
    }
  };

  const handleLogout = () => {
    setUser(null); // Limpia el estado del usuario en el contexto
    navigate('/'); // Redirige al usuario a la página de inicio
};

  return (
    <>
      <div className="header" style={{ backgroundColor: '#001745' }}>
        <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
          <i className="bi bi-list"></i>
        </button>
        <div className="logo-nombre">
          <button className="logo-button" onClick={() => navigate('/')}>
            <div className="logo">
              <img src={logo} className="img-logo" alt="portada" />
            </div>
          </button>
          <div className="nombre-app">
            <h3>HistoryHouse</h3>
          </div>
        </div>
        <div className="contenedor-buscador">
          <Buscador></Buscador>
        </div>
        <div className="contenedor-usuario">
          <div className="dropdown">
            <a className="btn btn-secundario dropdown-user" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-person"></i>
              {user ? user.nombreUsuario: "Usuario"}
            </a>
            <ul className="dropdown-menu">
            {user ? (
                <li>
                    <a className="dropdown-item" href="#" onClick={handleLogout}>
                        Cerrar sesión
                    </a>
                </li>
            ) : (
                <li>
                    <a className="dropdown-item" href="#" onClick={() => navigate('/Login')}>
                        Iniciar sesión
                    </a>
                </li>
            )}
            </ul>
          </div>
        </div>
      </div>
      <div
        className="offcanvas offcanvas-start sidebar-custom"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Filtros</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="dropdown mt-3">
        <button className="btn btn-secondary dropdown-toggle" type="button" onClick={handleCategoryClick} aria-expanded="false">
            Categoría
          </button>
          <ul className={`dropdown-menu ${isCategoryDropdownOpen ? 'show' : ''}`}>
            {categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.id}>
                  <a className="dropdown-item" href="#" onClick={() => navigate(`/categoria/${category.id}`)}>
                    {category.nombre}
                  </a>
                </li>
              ))
            ) : (
              <li className="dropdown-item">Cargando categorías...</li>
            )}
          </ul>
          <button className="btn btn-secondary dropdown-toggle" type="button" onClick={handleCountryClick} aria-expanded="false">
            Pais
          </button>
          <ul className={`dropdown-menu ${isCountryDropdownOpen ? 'show' : ''}`}>
            {countries.length > 0 ? (
              countries.map((country) => (
                <li key={country.id}>
                  <a className="dropdown-item" href="#" onClick={() => navigate(`/pais/${country.id}`)}>
                    {country.nombre}
                  </a>
                </li>
              ))
            ) : (
              <li className="dropdown-item">Cargando paises...</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;