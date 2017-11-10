import Base from './base'
import UserModel from '../models/user'
import MsgboxModel from '../models/msgbox'
import NavModel from '../models/nav'

class Admin extends Base {
    constructor(){
        super();
        this.checkLogin = this.checkLogin.bind(this);
        this.checkInstall = this.checkInstall.bind(this);
        this.lock = this.path.normalize(__dirname + '/../install/wlz_lock.js');
    }   
    async show(req, res) {
        if(req.method == 'GET') {
            const _id = req.session.user._id;
            try{
                const user = await UserModel.findOne({_id: _id});
                if(typeof user.avatar == 'undefined') user.avatar = '/images/0.jpg';
                const msgs = await MsgboxModel.findOne({uid: _id, status: 0});
                if(msgs && msgs.length > 0) {
                    for(let i=0; i<msgs.length; i++) {
                        msgs[i].id = msgs[i]._id;
                        delete msgs[i].from.password;
                    }
                    var msg = {code: 0, pages: 1, data: msgs};
                    var msgboxNum = msgs.length;
                }else {
                    var msg = {code:0, pages:1, data:{}};
                    var msgboxNum = 0;
                }
                return res.render('admin', {data: user, msgbox: msg, msgboxNum: msgboxNum});
            }catch(err) {
                console.log('获取管理员信息失败', err);
                return res.json({code: -1, type: 'GET_ADMIN_FAILED', msg: err});
            }
        }
    }
    checkLogin(req, res, next) {
        if(!this.rf.existsSync(this.lock)) return res.redirect('/system/install');
        next();
    }
    checkInstall(req, res, next) {
        if(this.rf.existsSync(this.lock)) return res.redirect('/login');
        next();
    }
    async checkAuth(req, res, next) {
        console.log(req.session);
        if(typeof req.session.user == 'undefined') return res.redirect('/login');
        const url = req.originalUrl;
        const user = req.session.user;
        if(user.name == 'admin' || url == '/admin') {
            next();
        }else {
            if(user.group.rules) {
                try{
                    let ruleArr = user.group.rules.split(',');
                    const nav = await NavModel.findOne({href: url});
                }catch(err) {
                    console.log('查找菜单节点失败', err);
                    return res.json({code: -1, msg: err, type: 'NAV_FIND_FAILED'});
                }
                if(!nav) return res.render('noauth');
                if(ruleArr.indexOf(nav._id) != -1) next();
                else {
                    if (req.headers['x-requested-with'] && req.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest') {
                        return res.json({code: 0, msg: 'u no auth', url: '/noauth'});
                    }else {
                        return res.render('noauth');
                    }
                }
            }
        }
    }
}

export default new Admin()