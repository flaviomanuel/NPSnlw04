import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import {resolve} from 'path';
import { AppError } from "../errors/AppError";

class SendMainController {
    
    async execute(request:Request, response: Response){
        const { email, survey_id} = request.body;

        const userRepository = getCustomRepository(UsersRepository)
        const surveysRepository = getCustomRepository(SurveyRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const user = await userRepository.findOne({ email })

        if(!user) {

            throw new AppError('User does not exist') 
        }

        const survey = await surveysRepository.findOne({id: survey_id})

        if(!survey){
            throw new AppError('Surveys does not exist')
        }

        const surveyUserAlreadyExist = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value:null},
            relations: ['user', 'survey']
        })

        const variables = {
            name: user.id,
            title: survey.title,
            description: survey.description,
            id: "", 
            link: process.env.URL_MAIL,
        }
        const npsPath = resolve(__dirname, '..',"views", "emails", "npsMail.hbs")

        
        if(surveyUserAlreadyExist) {
            variables.id = surveyUserAlreadyExist.id;
            await SendMailService.execute(email,survey.title, variables,npsPath)
            return response.json(surveyUserAlreadyExist)
        }
        //Salvar as informações na tabela surveysUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser)
        
        variables.id = surveyUser.id;

        await SendMailService.execute(email,survey.title, variables, npsPath)

        return response.json(surveyUser)
    }
}

export { SendMainController }