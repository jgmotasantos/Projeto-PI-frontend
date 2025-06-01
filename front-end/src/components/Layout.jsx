import "./Layout.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  HomeIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  BuildingOffice2Icon,
  UserIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

function Layout() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("User Account");
  const [notificacoes, setNotificacoes] = useState([]);
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsuario(payload.sub);

        const userId = payload.user_id;
        if (userId) {
          fetch(`http://localhost:8000/notificacoes/usuario/${userId}`)
            .then(res => res.json())
            .then(data => {
              if (Array.isArray(data)) {
                setNotificacoes(data);
              } else {
                setNotificacoes([]);
              }
            })
            .catch(() => setNotificacoes([]));
        } else {
          console.warn("user_id ausente no token");
          setNotificacoes([]);
        }
      } catch (e) {
        console.error("Erro ao decodificar token:", e);
        setUsuario("Usuário");
        setNotificacoes([]);
      }
    }
  }, []);



  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <button className="top-left-icon">
          <Bars3Icon className="icon large-icon" />
        </button>

        <div className="logo-container">
          <img src="/assets/logo-icon.png" alt="logo" className="logo-img-full" />
        </div>

        <nav className="menu">        
          <button className="icon-btn" onClick={() => navigate("/empresas")}>
            <BuildingOffice2Icon className="large-icon" />
          </button>
          <button className="icon-btn" onClick={() => navigate("/negocios")}>
            <BriefcaseIcon className="large-icon" />
          </button>
          <button className="icon-btn" onClick={() => navigate("/clientes")}>
            <UserIcon className="large-icon" />
          </button>
          <button className="icon-btn" onClick={() => navigate("/editais")}>
            <ClipboardDocumentListIcon className="large-icon" />
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          {mostrarNotificacoes && (
            <div style={{
              position: 'absolute',
              top: 70,
              color: 'black',
              fontSize: 20,
              right: 20,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
              width: '300px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              zIndex: 1000,
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: '10px' }}>
                {Array.isArray(notificacoes) && notificacoes.length > 0 ? (
                  notificacoes.map((n) => (
                    <li key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid #000', cursor: "pointer" }}>
                      {n.mensagem}
                    </li>
                  ))
                ) : (
                  <li>Nenhuma notificação</li>
                )}
              </ul>
            </div>
          )}


          <div className="search-wrapper">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              className="search-bar"
              type="text"
              placeholder="Pesquisar no CRMConnect"
            />
            <XMarkIcon className="clear-icon" />
          </div>

          <div className="topbar-actions">
            <PlusIcon className="icon circle" />
            <HomeIcon className="icon" />
            <Cog6ToothIcon className="icon" />
            <BellIcon className="icon" onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)} title="Notificações" />
            <ArrowRightOnRectangleIcon className="icon" onClick={handleLogout} title="Logout" />
            <div className="user-profile">
              <UserCircleIcon className="icon" />
              <span className="user">{usuario}</span>
            </div>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default Layout;
