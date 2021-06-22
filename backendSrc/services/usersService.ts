import { StatusCodes } from "http-status-codes";
import { errorCreatingObject, invalidUserEmail, invalidUserPasswordContent, invalidUserPasswordLength, missingFieldsMessage } from "../messages/errorMessage";
import { User as UserModel } from "../models/users/user";
import User from '../models/schemas/usersSchema';
import { validateUserEmail, validateUserMandatoryFields, validateUserPasswordContents, validUserPasswordLength } from "../validators/usersValidator";
import bcrypt from 'bcrypt';
import { USERS_MIN_PASSWORD_LENGTH } from "../config/config";

/**
 * Creates a user.
 * @param req http request.
 * @param resp https 
 */
export async function createUser(req: any, resp: any) {

    let user: UserModel = req.body;
    let missingFields: string[] = validateUserMandatoryFields(user);
    
    if(missingFields.length > 0){
        resp.status(StatusCodes.BAD_REQUEST).send(missingFieldsMessage(missingFields));
    }else if(!validUserPasswordLength(user.password, USERS_MIN_PASSWORD_LENGTH as number)){
        resp.status(StatusCodes.BAD_REQUEST).send(invalidUserPasswordLength(USERS_MIN_PASSWORD_LENGTH as number));
    }else if(!validateUserPasswordContents(user.password)){
        resp.status(StatusCodes.BAD_REQUEST).send(invalidUserPasswordContent);
    }else if(!validateUserEmail(user.email)){
        resp.status(StatusCodes.BAD_REQUEST).send(invalidUserEmail);
    } else{

        let hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        try{
            let usersSchema = await new User(user);
            usersSchema.save((err: any, user: any) => {
                if(err){
                    resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorCreatingObject("user"))
                }else{
                    resp.status(StatusCodes.CREATED).send(user)
                }
            })

        }catch(err){
            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
        }
    }
}