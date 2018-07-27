const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const actionDb = require('./data/helpers/actionModel');
const projectDb = require('./data/helpers/projectModel');

const server = express();
server.use(express.json()); // turn on express's body parser
server.use(cors()); // turn on CORS
server.use(helmet()); // security features, activated!

const PORT = 8000;

// middleware for project constraints
function projectConstraints(req, res, next) {
  const NAME = req.body.name;
  const DESCRIPTION = req.body.description;

  if (!NAME || !DESCRIPTION) {
    return next({
      code: 400,
      error: `Please provide a 'name' and 'description' for the new project.`,
    });
  }

  if (NAME.length > 128) {
    return next({
      code: 400,
      error: `The 'name' of the project must be fewer than 128 characters.`,
    });
  }
  next();
}

// middleware for action constraints
function actionConstraints(req, res, next) {
  const NOTES = req.body.notes;
  const DESCRIPTION = req.body.description;

  if (!NOTES || !DESCRIPTION) {
    return next({
      code: 400,
      error: `Please provide a 'description' and 'notes' for the new action.`,
    });
  }

  if (DESCRIPTION.length > 128) {
    return next({
      code: 400,
      error: `The 'description' of the action must be fewer than 128 characters.`,
    });
  }
  next();
}

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
    // response = 0, not deleted, 1 deleted
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
server.post(
  '/api/projects/:id/actions',
  actionConstraints,
  async (req, res, next) => {
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
        console.log('RESPONSE', response);
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
server.use((err, req, res, next) => {
  switch (err.code) {
    case 400:
      res.status(400).json({
        error: err.error,
      });
      return;

    case 500:
      res.status(500).json({
        error: err.error,
      });
      return;

    default:
      res.status(400).json({
        error: 'Something weird has happened!',
      });
      return;
  }
});

// not found - 404
server.use((req, res) =>
  res.status(404).send(`<h1>404: resource "${req.url}" not found</h1>`),
);

server.listen(
  PORT,
  console.log(`Server listening on http://localhost:${PORT}\n`),
);
