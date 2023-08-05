import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'; 
import { Router } from 'express';
import { User } from '../interfaces/user';
import AppError from '../utils/AppError';
import { CreateUserDTO } from '../dtos/teste.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
var bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const usersRoutes = Router();

usersRoutes.get('/', async (req: Request, res: Response) => {
  const users: User[] = await prisma.user.findMany();
  res.json(users);
});

usersRoutes.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const user: User | null = await prisma.user.findUnique({
    where: { id },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

usersRoutes.post('/', async (req: Request, res: Response) => {
    const { name, login, password } = req.body;


    // const createUserDTO: User = {
    //   name: "",
    //   login: "",
    //   password: "",
    // };

    const createUserDTO = new CreateUserDTO()
    createUserDTO.name = name
    createUserDTO.login = login
    createUserDTO.password = password

    const userTest = plainToClass(CreateUserDTO, createUserDTO)
    validate(userTest, { validationError: { target: false } }).then(
      async (errors) => {
        if (errors.length > 0) {
          res.send(errors)
        }
      },
    );
    
    const requiredFields = ['name', 'login', 'password'];

    const missingFields = requiredFields.filter((field) => !(field in req.body));
    console.log(Object.keys(req.body).includes("teste"))

    let fieldsNotValid: String[] = [] 

    Object.keys(req.body).forEach((item) => {
      if(!requiredFields.includes(item)){
        fieldsNotValid.push(item)
      }
    })

    // if (missingFields.length > 0) {
    //   const errorMessages = missingFields.map((field) => `${field}: ${typeof createUserDTO[field as keyof User]}`);
    //   return res.status(400).json({ error: `Required fields: ${errorMessages.join(', ')}` });
    // }

    if(fieldsNotValid.length > 0){
      try{
        throw new AppError(`Fields invalids: ${fieldsNotValid.join(",")}`)
      }catch(err){
        return res.status(400).send(err)
      }
    }

    const user: User | null = await prisma.user.findUnique({
      where: { login },
    });
  
    if (user) {
      return res.status(400).json({ message: 'Login already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 
  
    const newUser: User = await prisma.user.create({
      data: {
        name,
        login,
        password: hashedPassword, 
      },
    });

    const { password: _removed, ...newUserWithoutPassword } = newUser;
    
    res.json(newUserWithoutPassword);
  });

usersRoutes.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, login, password } = req.body;

  const updatedUser: User | null = await prisma.user.update({
    where: { id },
    data: {
      name,
      login,
      password,
    },
  });

  if (updatedUser) {
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

usersRoutes.delete('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedUser: User | null = await prisma.user.delete({
    where: { id },
  });

  if (deletedUser) {
    res.json(deletedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default usersRoutes;
