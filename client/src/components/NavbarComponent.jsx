import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import apiRequest from '../lib/apiRequest';
import { Login } from './Login';
import { AuthContext } from '../context/AuthContext';

export const NavbarComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const { currentUser, updateUser } = useContext(AuthContext);

  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">TaskItUp</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.name}</span>
              <span className="block truncate text-sm font-medium">{currentUser.email}</span>
            </Dropdown.Header>
            <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
            {/* Add more dropdown items as needed */}
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Navbar.Toggle />
        )}
      </div>
      <Navbar.Collapse className="navbar-collapse-custom">
        <Login openModal={openModal} setOpenModal={setOpenModal} />
      </Navbar.Collapse>
    </Navbar>
  );
};
