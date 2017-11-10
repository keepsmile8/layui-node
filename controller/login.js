import Base from './base'
import formidable from 'formidable'
import UserModel from '../models/user'

class Login extends Base{
    constructor() {
        super();
        this.login = this.login.bind(this);
    }
    login(req, res) {
        if(req.method == 'GET') {
            return res.render('login')
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                const {username, password, rememberMe} = fields;
                try{
                    if (!username) {
                        throw new Error('用户名参数错误');
                    }else if(!password){
                        throw new Error('密码参数错误');
                    }
                }catch(err){
                    console.log('登陆参数错误', err);
                    return res.json({code: -1, type: 'ERROR_QUERY', msg: err, url: '/login'});
                }
                const md5password = this.encryption(password)
                try{
                    let user = await UserModel.findOne({name: username}).populate('group');
                    if(!user) {
                        return res.json({code: -1, msg: '用户名不存在', url: '/login'})
                    }else if(user.password.toString() != md5password.toString()) {
                        return res.json({code: -2, msg: '请输入正确的密码', url: '/login'})
                    }else {
                        delete user.password
                        req.session.user = user;
                        const data = {online: 'online', logintime: this.moment().format('YYYY-MM-DD HH:mm:ss'), ip: req.connection.remoteAddress, sessionid: req.sessionID};
                        user = await UserModel.update({name: username}, data);
                        return res.json({code: 0, msg: '登录成功...', url: '/admin', user: user, delsession: user.sessionid})
                    }
                }catch(err) {
                    console.log('用户登录失败', err);
                    return res.json({code: -2, type: 'SAVE_USER_FAILED', msg: 'SAVE_USER_FAILED', url: '/login'});
                }
            })
        }
    }
    async loginout(req, res) {
        try{
            const user = req.session.user._id;
            await UserModel.update({_id: user}, {online:'offline', sessionid:''})
            delete req.session.user;
            return res.json({code:0, msg:'注销成功...', url:'/login', user:user});    
        }catch(err) {
            console.log('用户注销失败', err);
            return res.json({code: -1, msg: err, type: 'LOGINOUT_FAILED'});
        }
    }
}
export default new Login()