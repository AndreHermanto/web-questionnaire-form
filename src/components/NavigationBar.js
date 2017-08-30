import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import styled from 'styled-components';
import logo from '../assets/images/sanford-logo.jpg';

const WhiteNavbar = styled(Navbar)`
  background-color: white !important;
  background-image: none !important;
  background-repeat: no-repeat !important;
  box-shadow: none !important;
  padding: 15px 0
`;

export default class NavigationBar extends React.Component {
  render() {
    return (
      <WhiteNavbar>
        <Navbar.Header>
          <Navbar.Brand>
            <div style={{ padding: 0 }}>
              <img src={logo} alt="logo" width="120px" />
            </div>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Nav />
      </WhiteNavbar>
    );
  }
}
