import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {
  async registerUser(username: string, email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    return await user.save();
  }

  async loginUser(email: string, password: string): Promise<string | null> {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    }
    return null;
  }
}