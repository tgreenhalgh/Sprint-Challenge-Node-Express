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

module.exports.projectConstraints = projectConstraints;
module.exports.actionConstraints = actionConstraints;
