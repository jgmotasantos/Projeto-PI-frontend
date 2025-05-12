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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsuario(payload.sub);
      } catch {
        setUsuario("Usuário");
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
          <button className="icon-btn" onClick={() => navigate("/tarefas")}>
            <ClipboardDocumentListIcon className="large-icon" />
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
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
            <BellIcon className="icon" />
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
