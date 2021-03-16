import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup'
import { AppError } from '../errors/AppError';

class UserController {
    router: any;
    async create(request: Request, response: Response){
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        })

        try {
            await schema.validate(request.body, {abortEarly: false})
        } catch (err) {
            
                throw new AppError(err)

        }

        const userRepository = getCustomRepository(UsersRepository)

        const userAlredyExists = await userRepository.findOne({
            email
        })

        if(userAlredyExists) {
            throw new AppError('user already exists!')
            
        }
        const user = userRepository.create({
            name,
            email
        })

        await userRepository.save(user);

        return response.status(201).json(user)
    } 
}

export { UserController };

