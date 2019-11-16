import React from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import {PageType} from '../../App';
import './Header.css';

type HeaderProps = {
  pagetype: PageType,
  setPagetype: (ty: PageType) => void
};

const Header: React.FC<HeaderProps> = (props) => {

  const switchLink = (ty: PageType) => {
    switch(ty){
      case 'map':
        return <Nav.Link onClick={(e: any) => props.setPagetype('list')}>List</Nav.Link>;
      case 'list':
        return <Nav.Link onClick={(e: any) => props.setPagetype('map')}>Map</Nav.Link>
    }
  };
  return (
    <Navbar fixed='top' id='Header' expand="lg" variant='dark' >
      <Navbar.Brand onClick={(e: any) => props.setPagetype('list')}>WWWelcome</Navbar.Brand>
      <Nav className="mr-auto">
        {switchLink(props.pagetype)}
      </Nav>
    </Navbar>
  )
};

export default Header;