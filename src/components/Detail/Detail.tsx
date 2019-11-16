import React from 'react';
import { PlaceData } from '../../App';
import { Card, ListGroup } from 'react-bootstrap';

export type DetailProps = {
  place: PlaceData
};

const Detail: React.FC<DetailProps> = (props) => {
  return(
    <Card style={{marginTop: '5px'}}>
      <Card.Body>
        <Card.Title>{props.place.name}</Card.Title>
        <ListGroup variant="flush">
          <ListGroup.Item>{props.place.detail}</ListGroup.Item>
          <ListGroup.Item>{props.place.address}</ListGroup.Item>
          <ListGroup.Item>{`ここから${Math.round(props.place.dist)}m です．`}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Detail;