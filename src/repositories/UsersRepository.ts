import {Repository, EntityRepository} from "typeorm";
import { User } from "../models/User";
@EntityRepository(User)
export default class UsersRepository extends Repository<User>{

}

export { UsersRepository } 