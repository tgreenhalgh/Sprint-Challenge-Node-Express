import React from 'react';
import axios from 'axios';
import Actions from './Actions';

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: [],
      actions: [],
    };
  }

  componentDidMount() {
    // change this line to grab the id passed on the URL
    if (this.props.match) {
      this.fetchProject(this.props.match.params.id);
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

    axios
      .get(`http://localhost:8000/api/projects/${id}`)
      .then(response => {
        this.setState(() => ({ project: response.data }));
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    return (
      <div>
        <h1>{this.state.project.name}</h1>
        {this.state.actions.map(a => (
          <Actions key={a.id} action={a} project={this.state.project} />
        ))}
      </div>
    );
  }
}

export default Project;
