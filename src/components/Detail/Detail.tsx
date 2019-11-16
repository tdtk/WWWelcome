import React from 'react';
import { PlaceData } from '../../App';
import { Card } from 'react-bootstrap';

export type DetailProps = {
  place: PlaceData
};

const Detail: React.FC<DetailProps> = (props) => {
  return(
    <Card>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>{props.place.name}</Card.Title>
        <Card.Text>{props.place.detail}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Detail;