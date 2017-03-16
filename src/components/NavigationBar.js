import React from 'react';
import {
  Navbar,
  Nav
} from 'react-bootstrap';
import {
  Link
} from 'react-router';
import styled from 'styled-components';
import logo from '../assets/images/sanford-health-logo.png';

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
            <Link to="/"><img src={logo} alt="logo" width="104px" height="40px" /></Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Nav />
      </WhiteNavbar>
    );
  }
}
