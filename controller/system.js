import Base from './base'
import WebsiteModel from '../models/website'
import formidable from 'formidable'
import UserModel from '../models/user'
import GroupModel from '../models/group'

class System extends Base{
    constructor() {
        super();
        this.install = this.install.bind(this);
        this.index = this.index.bind(this);
    }
    async index(req, res) {
        if(req.method == 'GET') {
            try{
                let website = await WebsiteModel.findOne({});
                if(!website) {
                    website = {_id: '', title:'', seotitle:'', keywords:'', description:'', copyright:'', icpnum:'', tongji:''};
                }
                return res.render('system/website', {data:website});    
            }catch(err) {
                conssole.log('获取站点信息失败', err);
                return res.json({code: -1, msg: err, type: 'WEBINFO_GET_FAILED'});
            }
            
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {_id, title, seotitle, keywords, description, copyright, icpnum, tongji} = fields;
                    const data = {title: title, seotitle: seotitle, keywords: keywords, description: description, copyright: copyright, icpnum: icpnum, tongji: tongji};
                    if(!_id) {
                        await WebsiteModel.create(data)
                    }else {
                        await WebsiteModel.update({_id: _id}, data)
                    }
                    return res.json({code:0, msg:'更新成功', url:'/system/website'})    
                }catch(err) {
                    console.log('站点信息更新失败', err);
                    return res.json({code: -1, msg: err, type: 'WEBINFO_SAVE_FAILED'});
                }
            })
        }
    }
    install(req, res) {
        if(req.method == 'GET') {
            return res.render('install/index');
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                const {user, password} = fields;
                const md5password = this.encryption(password);
                try {
                    const group = await GroupModel.create({name: '管理员', status: 1, weight: 0, create_time: this.moment().format('YYYY-MM-DD HH:mm')});
                    await UserModel.create({name: user, password: md5password, group: group._id, status: 1, create_time: this.moment().format('YYYY-MM-DD HH:mm')});
                    const dir = this.path.normalize(__dirname + '/../install');
                    if (!this.rf.existsSync(dir)) this.rf.mkdirSync(dir);
                    const lock = dir + '/wlz_lock.js';
                    this.rf.createWriteStream(lock);
                    return res.json({code: 0, msg: '安装成功', url: '/login'});
                }catch(err) {
                    console.log('安装失败', err);
                    return res.json({code: -1, msg: '安装失败', url: '/install'});
                }
            })
        }
    }
}

export default new System()