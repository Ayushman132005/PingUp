import {Router} from 'express';

const Router = Router();

// Example route to get all users
Router.get('/', async (req, res) => {
  // Logic to fetch users from database would go here
  res.json({ message: 'List of users' });
});

export default Router;