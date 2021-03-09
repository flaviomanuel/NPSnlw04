import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import {resolve} from 'path';

class SendMainController {
    
    async execute(request:Request, response: Response){
        const { email, survey_id} = request.body;

        const userRepository = getCustomRepository(UsersRepository)
        const surveysRepository = getCustomRepository(SurveyRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const user = await userRepository.findOne({ email })

        if(!user) {
            return response.status(400).json({
                error: "User does not exist",
            });
        }

        const survey = await surveysRepository.findOne({id: survey_id})

        if(!survey){
            return response.status(400).json({
                error: "Surveys does not exist",
            });
        }

        const variables = {
            name: user.id,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL,
        }
        const npsPath = resolve(__dirname, '..',"views", "emails", "npsMail.hbs")


        const surveyUserAlreadyExist = await surveysUsersRepository.findOne({
            where: [{user_id: user.id}, {value:null}],
            relations: ['user', 'survey']
        })
        
        if(surveyUserAlreadyExist) {
            await SendMailService.execute(email,survey.title, variables,npsPath)
            return response.json(surveyUserAlreadyExist)
        }
        //Salvar as informações na tabela surveysUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser)


        

        await SendMailService.execute(email,survey.title, variables, npsPath)

        return response.json(surveyUser)
    }
}

export { SendMainController }