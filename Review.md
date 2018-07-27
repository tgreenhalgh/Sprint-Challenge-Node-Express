# Review Questions

## What is Node.js?

Node.js is an open source project for running JavaScript out of the browser. It is used for writing servers and other tools.

## What is Express?

Express is a library for Node.js that is used to help write server functionality, including APIs.

## Mention two parts of Express that you learned about this week.

Amongst other things, we learned about routing and middleware.

## What is Middleware?

A function that returns a function. In the case of node/express, it gives the coder a chance to make changes to the flow of data in the request-response cycle. `Next()` must be included for the flow to continue. Useful for things like checking authentication status.

## What is a Resource?

A way of thinking about routes - what resource is needed, what should the endpoint be.

## What can the API return to help clients know if a request was successful?

Status codes can be used to let clients know if requests were successful or not.

## How can we partition our application into sub-applications?

By breaking the application into modules that are then required where needed.

## What is express.json() and why do we need it?

It turns on "body parsing" to read req.body in the JSON format.
