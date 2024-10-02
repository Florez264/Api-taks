import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const user = await userService.registerUser(username, email, password);
      res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  } 

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await userService.loginUser(email, password);
      if (token) {
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  }
}