import * as yup from 'yup';
import User from '../models/User.js';
import * as bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authconfig from './../../config/auth.js';


class SessionController {
  async store(request, response) {
   
    const schema = yup.object({
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(request.body);
    if (!isValid) {
      return response
        .status(400)
        .json({ error: 'Email or password incorrect' });
    }

  
    const { email, password } = request.body;

 
    const existingUser = await User.findOne({
      where: { email },
    });

    if (!existingUser) {
      return response
        .status(400)
        .json({ error: 'Email or password incorrect' });
    }

   
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      existingUser.password_hash
    );

    if (!isPasswordCorrect) {
      return response
        .status(400)
        .json({ error: 'Email or password incorrect' });
    }

    const token = jwt.sign({ id: existingUser.id,
       admin: existingUser.admin,
       name: existingUser.name
      },
       authconfig.sectret, {
      expiresIn: authconfig.expiresin
    })
   
    return response.status(200).json({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      admin: existingUser.admin,
      token,
    });
  }
}

export default new SessionController();
