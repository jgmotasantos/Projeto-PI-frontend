import "./Layout.css";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="logo"></div>
        <nav className="menu">
          <img src="/assets/icon1.png" alt="Icon 1" />
          <img src="/assets/icon2.png" alt="Icon 2" />
          <img src="/assets/icon3.png" alt="Icon 3" />
          <img src="/assets/icon4.png" alt="Icon 4" />
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <input
            className="search-bar"
            type="text"
            placeholder="Pesquisar no CRMConnect"
          />
          <div className="topbar-actions">
            <button className="add-btn">+</button>
            <img src="/assets/home-icon.png" alt="home" />
            <img src="/assets/settings-icon.png" alt="settings" />
            <img src="/assets/bell-icon.png" alt="notifications" />
            <img src="/assets/logout-icon.png" alt="logout" />
            <div className="user">User Account</div>
          </div>
        </header>

        <section className="page-content">
          <Outlet /> {/* Aqui será renderizado o conteúdo de cada tela */}
        </section>
      </main>
    </div>
  );
}

export default Layout;
