import crypto from 'crypto'
import rf from 'fs'
import path from 'path'
import moment from 'moment'

class Base {
    constructor() {
        this.rf = rf;
        this.path = path;
        this.moment = moment;
    }
    encryption(password) {
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newpassword;
    }
    Md5(password) {
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }
}

export default Base