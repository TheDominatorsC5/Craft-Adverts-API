import { hash, compare } from "bcryptjs";
import {createHmac} from "crypto"

export const hashPass = (password, salt) => {
    const result = hash(password, salt);
    return result;
}

export const hashValidation = (value, hashedValue) => {
    const result = compare(value, hashedValue);
    return result;
};

export const hmacProcess = (value, key) => {
    const result = createHmac('sha256', key).update(value).digest('hex');
    return result;
}