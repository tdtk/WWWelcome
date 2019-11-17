import React from 'react';
import {Nav, Navbar, Button, Form} from 'react-bootstrap';
import {PageType} from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons'

import './Header.css';

type HeaderProps = {
  pagetype: PageType,
  setPagetype: (ty: PageType) => void,
  getPosition: () => void
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
      <Form.Control as="select" style={{width: '60px', marginRight: '1vw'}}>
        <option>JP</option>
      </Form.Control>
      <Button onClick={props.getPosition} id='get-position-button'><FontAwesomeIcon icon={faCrosshairs} /></Button>
    </Navbar>
  )
};

export default Header;