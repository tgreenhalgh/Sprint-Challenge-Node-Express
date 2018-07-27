import React from 'react';
import { Card, CardTitle, CardText, Row, Col } from 'reactstrap';

const Actions = props => {
  return (
    <Row>
      <Col sm="6">
        <Card body>
          <CardTitle>Desc: {props.action.description}</CardTitle>
          <CardText>Notes: {props.action.notes}</CardText>
          <CardText>
            Completed: {props.action.completed ? 'true' : 'false'}
          </CardText>
        </Card>
      </Col>
    </Row>
  );
};

export default Actions;
