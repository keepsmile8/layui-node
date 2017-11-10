import Base from './base'
import formidable from 'formidable'
import GroupModel from '../models/group'
import NavModel from '../models/nav'

class Group extends Base{
    constructor(){
        super();
        this.add = this.add.bind(this);
    }
    list(req, res) {
        if(req.method == 'GET') {
            res.render('groups/groups') 
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {pageIndex, pageSize} = fields;
                    const groupSum = await GroupModel.find({});
                    const groups = await GroupModel.find({}).skip(Number( (pageIndex-1)*pageSize )).limit(Number(pageSize));
                    return res.json({code: 0, msg: '获取成功', list: groups, count: groupSum.length})
                }catch(err){
                    console.log('获取用户组错误', err)
                    return res.json({code: -1, msg: err, type: 'GROUP_GET_FAILED'});
                }
            })
        }
    }
    add(req, res) {
        if(req.method == 'GET') {
            res.render('groups/add');
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {name, weight, status} = fields;
                    await GroupModel.create({name: name, status: Number(status), weight: Number(weight), create_time: this.moment().format('YYYY-MM-DD HH:mm')});
                    return res.json({code:0, msg:'创建成功', url:'/admin/group'})
                }catch(err) {
                    console.log('添加组失败', err);
                    return res.json({code: -1, msg: err, type: 'GROUP_ADD_FAILED'});
                }
            })
        }
    }
    async del(req, res) {
        try{
            const _id = req.params.id;
            await GroupModel.remove({_id: _id});
            return res.json({code: 0, msg: '删除成功', url: '/admin/group'})
        }catch(err) {
            console.log('删除组失败', err);
            return res.json({code: -1, msg: err, type: 'GROUP_DEL_FAILED'});
        }
    }
    async edit(req, res) {
        if(req.method == 'GET') {
            try{
                const _id = req.params.id;
                const group = await GroupModel.findOne({_id: _id});
                res.render('groups/edit', {group: group});
            }catch(err) {
                console.log('查询待编辑组失败', err);
                return res.json({code: -1, msg: err, type: 'GROUP_FIND_FAILED'});
            }
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {_id, name, weight, status} = fields;
                    const data = {name: name, weight: Number(weight), status: Number(status)};
                    await GroupModel.update({_id: _id}, data)
                    return res.json({code:0, msg:'更新成功', url:'/admin/group'});
                }catch(err) {
                    console.log('组更新失败', err);
                    return res.json({code: -1, msg: err, type: 'GROUP_SAVE_FAILED'});
                }
            })
        }
    }
    async auth(req, res) {
        if(req.method == 'GET') {
            try{
                const _id = req.params.id;
                const group = await GroupModel.findOne({_id: _id});
                return res.render('groups/auth', {group: group});    
            }catch(err) {
                console.log('查询待授权组失败', err);
                return res.json({code: -1, msg: err, type: 'GROUP_FIND_FAILED'});
            }
        }
    }
    getJson(req, res) {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            try{
                const _id = fields._id;
                const nav = await NavModel.find({});
                for(var i=0; i<nav.length; i++) {
                    nav[i].level = nav[i].path.split(',').length;
                }
                return res.json({code: 0, msg: '获取成功', list: nav, count: nav.length})
            }catch(err) {
                console.log('获取菜单失败', err);
                return res.json({code: -1, msg: err, type: 'NAV_GET_FAILED'});
            }
        })
    }
    updateRule(req, res) {
        const form = formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            try{
                const {_id, rules} = fields;
                await GroupModel.update({_id: _id}, {rules: rules});
                return res.json({code:0, msg:'更新成功', url:'/admin/group'});
            }catch(err) {
                console.log('更新组规则失败', err);
                return res.json({code: -1, msg: err, type: 'GROUP_SAVE_FAILED'});
            }
        })
    }
}

export default new Group()