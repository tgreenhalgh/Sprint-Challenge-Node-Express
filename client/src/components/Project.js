import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: [],
      actions: [],
      id: 0,
    };
  }

  componentDidMount() {
    // change this line to grab the id passed on the URL
    if (this.props.match) {
      this.fetchProject(this.props.match.params.id);
      this.setState({ id: this.props.match.params.id });
    }
  }

  fetchProject = id => {
    axios
      .get(`http://localhost:8000/api/projects/${id}/actions`)
      .then(response => {
        this.setState(() => ({ actions: response.data }));
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    return (
      <Row>
        <Col sm="6">
          <Card body>
            <CardTitle>{this.props.project.name}</CardTitle>
            <CardText>{this.props.project.description}</CardText>
            <Link
              style={{ textDecoration: 'none' }}
              to={`/project/${this.props.project.id}`}
            >
              <Button>see actions</Button>
            </Link>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Project;
