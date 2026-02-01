import { v4 } from 'uuid';
import User from '../models/User.js';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';

class UserController {
  async store(request, response) {
  try {
    const { name, email, password, admin } = request.body;

    if (!password || password.length < 6) {
      return response
        .status(400)
        .json({ message: 'password required (min 6)' });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return response.status(400).json({
        message: 'email already taken',
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
        
      name,
      email,
      password_hash,
      admin: admin ?? false,
    });

    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
    });
  } catch (err) {
    console.error(err);
    return response.status(500).json({
      error: err.message,
    });
  }
}

}

export default new UserController();
