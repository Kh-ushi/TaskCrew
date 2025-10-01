import React, { useState, useRef, useEffect } from "react";

import "./Notifications.css";

const Notifications = ({ open, setOpen, notifications }) => {
    const dropdownRef = useRef(null);
    console.log("Notifications Component:", notifications);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="notification-wrapper" ref={dropdownRef}>


            {open && (
                <div className="notification-box">
                    <h4>Notifications</h4>
                    <div className="notif-list">
                        {notifications.map((notif, index) => {
                                return (
                                    <div
                                        key={notif._id}
                                        className={`notif-item ${!notif.read ? "unread" : ""}`}
                                    >
                                        <p className="notif-message">{notif.message}</p>
                                        <span className="notif-time">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                );
                        })}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Notifications;
