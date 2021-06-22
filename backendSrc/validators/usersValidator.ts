import { User } from "../models/users/user";

/**
 * Validate a given user object has all the mandatory fields.
 * @param user user.
 * @returns an array containing the invalid fields, if there are any present
 */
export function validateUserMandatoryFields(user: User) {
    let invalidFields = [];
    if (!user.firstName) {
        invalidFields.push('firstName')
    }
    if (!user.lastName) {
        invalidFields.push('lastName')
    }
    if (!user.email) {
        invalidFields.push('email')
    }
    if (!user.password) {
        invalidFields.push('password')
    }

    return invalidFields;
}

/**
 * Validates a users password length.
 * @param userPassword 
 * @returns true, if valid.
 */
export function validUserPasswordLength(userPassword: string, minLength: number){

    if(userPassword.length < minLength){
        return false;
    }

    return true;
}

/**
 * Validates a users password contents.
 * @param userPassword 
 * @returns true, if valid.
 */
export function validateUserPasswordContents(userPassword: string){

    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
    if(!passwordRegex.test(userPassword)){
        return false;
    }
    
    return true;
}

/**
 * Validates a users email.
 * @param userEmail 
 * @returns true, if valid.
 */
export function validateUserEmail(userEmail: string){

    let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    if(!emailRegex.test(userEmail)){
        return false;
    }
    
    return true;
}