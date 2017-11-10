import Base from './base'
import formidable from 'formidable'
import AuthModel from '../models/auth'

class Auth extends Base{
    constructor() {
        super();
        this.add = this.add.bind(this);
    }
    list(req, res) {
        if(req.method == 'GET') {
            return res.render('auths/auths');
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {pageIndex, pageSize} = fields;
                    const auth = await AuthModel.find({}).skip(Number( (pageIndex-1)*pageSize )).limit(Number(pageSize));
                    const authSum = await AuthModel.find({});
                    return res.json({code: 0, msg: '获取成功', list: auth, count: authSum.length});
                }catch(err) {
                    console.log('获取权限失败', err);
                    return res.json({code: -1, msg: err, type: 'AUTH_GET_FAILED'});
                }
            })
        }
    }
    add(req, res) {
        if(req.method == 'GET') {
            return res.render('auths/add');
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {name, url, sort, status} = fields;
                    await AuthModel.create({name: name, sort: Number(sort), status: Number(status), url: url, create_time: this.moment().format('YYYY-MM-DD HH:mm')});
                    return res.json({code: 0, msg: '创建成功', url: '/admin/auth'});
                }catch(err) {
                    console.log('添加权限失败', err);
                    return res.json({code: -1, msg: err, type: 'AUTH_ADD_FAILED'});
                }
                
            })
        }
    }
    async del(req, res) {
        try{
            const _id = req.params.id;
            await AuthModel.remove({_id: _id});
            return res.json({code: 0, msg: '删除成功', url: '/admin/auth'})
        }catch(err) {
            console.log('删除权限失败', err);
            return res.json({code: -1, msg: err, type: 'AUTH_DEL_FAILER'});
        }
        
    }
    async edit(req, res) {
        if(req.method == 'GET') {
            try{
                const _id = req.params.id;
                const auth = await AuthModel.findOne({_id: _id});
                return res.render('auths/edit', {data: auth});    
            }catch(err) {
                console.log('获取待编辑权限失败', err);
                return res.json({code: -1, msg: err, type: 'AUTH_FIND_FAILED'});
            }
            
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {_id, name, url, sort, status} = fields;
                    const data = {name: name, url: url, sort: Number(sort), status: Number(status)};
                    await AuthModel.update({_id: _id}, data)
                    return res.json({code: 0, msg: '更新成功', url: '/admin/auth'});
                }catch(err) {
                    console.log('权限更新失败', err);
                    return res.json({code: -1, msg: err, type: 'AUTH_UPDATE_FAILED'});
                }
            })
        }
    }
}

export default new Auth()