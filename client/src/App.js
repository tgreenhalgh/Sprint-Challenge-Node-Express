import React, { Component } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import Projects from './components/Projects';
import ProjectActions from './components/ProjectActions';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:8000/api/projects')
      .then(response => this.setState({ projects: response.data }))
      .catch(err => console.log('ERR:', err));
  }

  render() {
    return (
      <div>
        <Route
          exact
          path="/"
          render={props => (
            <Projects {...props} projects={this.state.projects} />
          )}
        />
        <Route
          path="/project/:id"
          render={props => (
            <ProjectActions {...props} projects={this.state.projects} />
          )}
        />
      </div>
    );
  }
}

export default App;
