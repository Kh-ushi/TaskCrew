import React, { useState } from "react";
import { Bell, CircleCheckBig, Search } from "lucide-react";
import "./Navbar.css";
import {useNotification} from "../Notifications/NotificationsProvider.jsx";
import NotificationPopup from "../Notifications/NotificationPopUp.jsx";

export default function Navbar({isMainSpace=false}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { unread, notifications,onJoin } = useNotification();
  const [notifOpen, setNotifOpen] = useState(false);

  console.log("Notifications:");
  console.log(unread, notifications);

  return (
    <header className="nb-wrap">
      <div className="nb-inner">
        {/* Left: brand */}
        <div className="nb-left">
          <button
            className="nb-burger"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

         {!isMainSpace && (
            <div className="nb-brand">
            <CircleCheckBig size={22} />
            <span>TaskCrew</span>
          </div>
         )}
        </div>

        {/* Center: Search */}
        <div className={`nb-search ${searchOpen ? "is-open" : ""}`}>
          <span className="nb-search-ico" aria-hidden>🔎</span>
          <input
            type="text"
            placeholder="Search anything"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
        </div>

        {/* Right: actions */}
        <nav className="nb-right">
          {/* Mobile search toggle */}
          <button
            className="nb-icon nb-search-btn"
            aria-label="Open search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search size={18} />
          </button>

          <button className="nb-icon nb-bell" aria-label="Notifications" onClick={() => setNotifOpen(true)}>
            <Bell size={18} />
            <span className="nb-dot">{unread}</span>
          </button>

          <div className="nb-profile">
            <div className="nb-avatar" aria-hidden>ST</div>
            <div className="nb-user">
              <div className="nb-name">Stanley</div>
              <div className="nb-role">Designer</div>
            </div>
            <span className="nb-caret" aria-hidden>▾</span>
          </div>
        </nav>
      </div>

      {/* Mobile dropdown (example) */}
      {menuOpen && (
        <div className="nb-mobile">
          <a href="#dashboard">Dashboard</a>
          <a href="#projects">Projects</a>
          <a href="#team">Team</a>
          <a href="#settings">Settings</a>
        </div>
      )}

      {notifOpen && (
        <NotificationPopup
          open={notifOpen}
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onMarkAllRead={() => {}}
          onDismiss={() => {}}
          onToggleRead={() => {}}
          onJoin={onJoin}
        />
      )}
    </header>
  );
}
