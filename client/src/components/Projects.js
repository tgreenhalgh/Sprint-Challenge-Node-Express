import React from 'react';
import Project from './Project';

const Projects = props => {
  return (
    <div>{props.projects.map(p => <Project key={p.id} project={p} />)}</div>
  );
};

export default Projects;
