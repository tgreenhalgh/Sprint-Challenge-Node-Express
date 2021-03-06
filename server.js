const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const actionDb = require('./data/helpers/actionModel');
const projectDb = require('./data/helpers/projectModel');
// get my custom middleware
const { projectConstraints, actionConstraints } = require('./middleware');
const errors = require('./middleware/errors');

const server = express();
server.use(express.json()); // turn on express's body parser
server.use(cors()); // turn on CORS
server.use(helmet()); // security features, activated!

const PORT = 8000;

server.get('/', (req, res) => {
  res.send('TADA! it is working:)');
});

// get all projects
server.get('/api/projects', async (req, res, next) => {
  try {
    const response = await projectDb.get();
    return res.status(200).json(response);
  } catch (err) {
    return next({
      code: 500,
      error: `The projects information could not be retrieved.`,
    });
  }
});

// display an individual project
server.get('/api/projects/:id', async (req, res, next) => {
  const ID = req.params.id;

  try {
    const response = await projectDb.get(ID);
    return res.status(200).json(response);
  } catch (err) {
    return next({
      code: 500,
      error: `Project id:${ID} could not be retrieved.`,
    });
  }
});

// display an individual project's actions
server.get('/api/projects/:id/actions', async (req, res, next) => {
  const ID = req.params.id;

  // make sure we have the project
  try {
    await projectDb.get(ID);
    // have the project, get the associated actions
    try {
      const response = await projectDb.getProjectActions(ID);
      return res.status(200).json(response);
    } catch (err) {
      return next({
        code: 500,
        error: `Project id:${ID}'s actions could not be retrieved.`,
      });
    }
  } catch (err) {
    return next({
      code: 500,
      error: `Project id:${ID} could not be retrieved.`,
    });
  }
});

// add a new project
server.post('/api/projects', projectConstraints, async (req, res, next) => {
  const NAME = req.body.name;
  const DESCRIPTION = req.body.description;

  const project = { name: NAME, description: DESCRIPTION };

  try {
    const response = await projectDb.insert(project);
    return res.status(200).json(`Project id:${response.id} has been added.`);
  } catch (err) {
    return next({
      code: 500,
      error: `The project could not be added.`,
    });
  }
});

// delete a project
server.delete('/api/projects/:id', async (req, res, next) => {
  const ID = req.params.id;

  try {
    const response = await projectDb.remove(ID);
    // response = 0 not deleted, 1 deleted
    if (response)
      return res.status(200).json(`Project id:${ID} has been deleted.`);
    else return next({ code: 500, error: `Project id:${ID} does not exist.` });
  } catch (err) {
    return next({ code: 500, error: `Project id:${ID} could not be deleted.` });
  }
});

// edit a project
server.put('/api/projects/:id', projectConstraints, async (req, res, next) => {
  const ID = req.params.id;
  const NAME = req.body.name;
  const DESCRIPTION = req.body.description;

  const project = { name: NAME, description: DESCRIPTION };

  // make sure we have the project to edit
  try {
    await projectDb.get(ID);
    // we have a project
    try {
      const response = await projectDb.update(ID, project);
      return res
        .status(200)
        .json(`Project id:${response.id} has been updated.`);
    } catch (err) {
      return next({
        code: 500,
        error: `The project could not be updated.`,
      });
    }
  } catch (err) {
    return next({
      code: 500,
      error: `Project id:${ID} could not be retrieved.`,
    });
  }
});

// get all actions
server.get('/api/actions', async (req, res, next) => {
  try {
    const response = await actionDb.get();
    return res.status(200).json(response);
  } catch (err) {
    return next({
      code: 500,
      error: `The actions information could not be retrieved.`,
    });
  }
});

// display an individual action
server.get('/api/actions/:id', async (req, res, next) => {
  const ID = req.params.id;

  try {
    const response = await actionDb.get(ID);
    return res.status(200).json(response);
  } catch (err) {
    return next({
      code: 500,
      error: `Action id:${ID} could not be retrieved.`,
    });
  }
});

// delete an action
server.delete('/api/actions/:id', async (req, res, next) => {
  const ID = req.params.id;

  try {
    const response = await actionDb.remove(ID);
    // response = 0, not deleted, 1 deleted
    if (response)
      return res.status(200).json(`Action id:${ID} has been deleted.`);
    else return next({ code: 500, error: `Action id:${ID} does not exist.` });
  } catch (err) {
    return next({ code: 500, error: `Action id:${ID} could not be deleted.` });
  }
});

// add a new action to a project
/* prettier-ignore */
server.post('/api/projects/:id/actions', actionConstraints, async (req, res, next) => {
  const ID = req.params.id;
  const NOTES = req.body.notes;
  const DESCRIPTION = req.body.description;
  
  const action = { project_id: ID, notes: NOTES, description: DESCRIPTION };
  
  // check to make sure we have a project to add the action to
  try {
    await projectDb.get(ID);
    // we have a project
    try {
      const response = await actionDb.insert(action);
      return res.status(200).json(`Action id:${response.id} has been added.`);
    } catch (err) {
      return next({
        code: 500,
        error: `The action could not be added.`,
      });
    }
  } catch (err) {
    return next({
      code: 500,
      error: `Project id:${ID} could not be retrieved.`,
    });
  }
},
);

// edit an action
server.put('/api/actions/:id', actionConstraints, async (req, res, next) => {
  const ID = req.params.id;
  const NOTES = req.body.notes;
  const DESCRIPTION = req.body.description;

  const action = { notes: NOTES, description: DESCRIPTION };

  // check to make sure we have an action to edit
  try {
    await actionDb.get(ID);
    try {
      const response = await actionDb.update(ID, action);
      return res.status(200).json(`Action id:${response.id} has been updated.`);
    } catch (err) {
      return next({
        code: 500,
        error: `The action could not be updated.`,
      });
    }
  } catch (err) {
    return next({
      code: 500,
      error: `Action id:${ID} could not be retrieved.`,
    });
  }
});

// error handling
server.use(errors);

// not found - 404
server.use((req, res) =>
  res.status(404).send(`<h1>404: resource "${req.url}" not found</h1>`),
);

server.listen(
  PORT,
  console.log(`Server listening on http://localhost:${PORT}\n`),
);
