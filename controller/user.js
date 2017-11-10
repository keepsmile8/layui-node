import Base from './base'
import formidable from 'formidable'
import UserModel from '../models/user'
import GroupModel from '../models/group'

class User extends Base{
    constructor() {
        super();
        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }
    async list(req, res) {
        if(req.method == 'GET') {
            return res.render('admins/users');
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                const {pageIndex, pageSize} = fields;
                try{
                    const userSum = await UserModel.find({});
                    const users = await UserModel.find({}).skip(Number( (pageIndex-1)*pageSize )).limit(Number(pageSize));
                    return res.json({code: 0, msg: '获取成功', list: users, count: userSum.length});
                }catch(err) {
                    console.log('获取用户列表失败', err)
                    return res.json({code: -1, msg: err, type: 'USER_GET_FAILED'});
                }
                
                
            })
        }
    }
    add(req, res) {
        if(req.method == 'GET') {
            return res.render('admins/add');
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {name, position, status} = fields;
                    const obj = {name: name, status: status, position: position, group: '59a3d3fc6578e81b9c5d1d4d', online: 'offline', sessionid: '', create_time: this.moment().format('YYYY-MM-DD HH:mm')};
                    const user = await UserModel.create(obj);
                    const url = req.originalUrl
                    return res.json({code: 0, msg: '添加成功', url: '/admin/user/common'});
                }catch(err) {
                    console.log('用户添加失败', err);
                    return res.json({code: -1, msg: err, type: 'USER_ADD_FAILED'});
                }
            })
        }
    }
    async edit(req, res) {
        if(req.method == 'GET') {
            try{
                const _id = req.params.id;
                const user = await UserModel.findOne({_id: _id});
                const groups = await GroupModel.find({});
                return res.render('admins/edit', {user: user, gourps: groups});
            }catch(err) {
                console.log('编辑用户出错', err)
                return res.json({code: -1, type: 'EDIT_USER_FAILED', msg: err})
            }
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {_id, name, position, password, repassword, status, groups} = fields;
                    if(groups.length != 24) return res.json({code: -1, msg: '请选择有效的组', url: '/admin/user/common'})
                    if(password != repassword) {
                        return res.json({code: -10, msg: '两次输入的密码不一致', url: '/admin/user/common'});
                    }
                    const md5Password = this.encryption(password);
                    const data = {name: name, password: md5Password, status: status, group: groups, position: position};
                    await UserModel.update({_id: _id}, data);
                    return res.json({code: 0, msg: '修改成功', url: '/admin/user/common'});
                }catch(err) {
                    console.log('用户更新失败', err);
                    return res.json({code: -1, msg: err, type: 'USER_UPDATE_FAILED'});
                }
            })
        }
    }
    async del(req, res) {
        try{
            const _id = req.params.id;
            await UserModel.remove({_id: _id});
            return res.json({code: 0, msg: '删除成功', url: '/admin/user/common'})
        }catch(err) {
            console.log('用户删除失败', err);
            return res.json({code: -1, msg: err, type: 'USER_DEL_FAILED'});
        }
    }
}
export default new User()