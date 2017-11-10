import Base from './base'
import formidable from 'formidable'
import NavModel from '../models/nav'

class Nav extends Base{
    constructor(){
        super();
    }
    list(req, res) {
        if(req.method == 'GET') {
            return res.render('navs/navs')
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {pageIndex, pageSize} = fields;
                    let nav = await NavModel.find({}).sort({path: 1});
                    let parent = [];
                    for(let i=0; i<nav.length; i++) {
                        parent[nav[i]._id] = nav[i];
                        nav[i].level = nav[i].path.split(',').length;
                    }
                    return res.json({code: 0, msg: '获取成功', list: nav});    
                }catch(err) {
                    console.log('获取菜单失败', err);
                    return res.json({code: -1, msg: err, type: 'NAV_GET_FAILED'});
                }
            })
        }
    }
    async add(req, res) {
        if(req.method == 'GET') {
            try{
                let nav = await NavModel.find({});
                for(let i=0; i<nav.length; i++) {
                    let level = nav[i].path.split(',').length;
                    let pre = '';
                    for(let j=0; j<level-1; j++) {
                        pre += "|----";
                    }
                    nav[i].name = pre + nav[i].name;
                }
                return res.render('navs/add', {navs:nav});
            }catch(err) {
                console.log('获取菜单失败', err);
                return res.json({code: -1, msg: err, type: 'NAV_GET_FAILED'});
            }
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                const {pid, name, href, icon, status, sort} = fields;
                const data = {pid: pid, name: name, href: href, icon: icon, status: Number(status), sort: Number(sort)};
                try{
                    const nav = await NavModel.create(data);
                    let path = nav._id.toString();
                    if(nav.pid == '000000000000000000000000') {
                        await NavModel.update({_id: path}, {path: path})
                    }else {
                        const _n = await NavModel.findOne({_id: nav.pid});
                        let _path = _n.path + ',' + path;
                        await NavModel.update({_id: path}, {path: _path});
                    }
                    return res.json({code:0, msg:'创建成功', url:'/admin/nav'});
                }catch(err) {
                    console.log('菜单创建失败', err)
                    return res.json({code:-1, msg: err, type: 'NAV_ADD_FAILED'});
                }  
            })
        }
    }
    async edit(req, res) {
        if(req.method == 'GET') {
            const _id = req.params.id;
            try{
                const nav = await NavModel.findOne({_id: _id});
                const navSum = await NavModel.find({});
                if(navSum.length > 0) {
                    for(var i=0; i<navSum.length; i++) {
                        var level = navSum[i].path.split(',').length;
                        var pre = '';
                        for(var j=0; j<level-1; j++) {
                            pre += "|----";
                        }
                        navSum[i].name = pre + navSum[i].name;
                    }
                }
                return res.render('navs/edit', {nav:nav, navs:navSum});
            }catch(err) {
                console.log('获取待编辑菜单失败', err);
                return res.json({code: -1, msg: err, type: 'NAV_GET_FAILED'});
            }
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try {
                    const {pid, name, href, icon, status, sort, _id} = fields
                    const data = {pid: pid, name: name, href: href, icon: icon, status: Number(status), sort: Number(sort)};
                    if(pid == '000000000000000000000000') {
                        data.path = _id;
                        await NavModel.update({_id: _id}, data);
                    }else {
                        const parent = await NavModel.findOne({_id: pid});
                        data.path = parent.path + ',' + _id;
                        await NavModel.update({_id: _id}, data)
                    }
                    const child = await NavModel.find({pid: _id});
                    if(child.length > 0) {
                        let promises = child.map(d => NavModel.update({_id: d._id}, {path: data.path + ',' + d._id}));
                        let results = await Promise.all(promises);
                    }
                    return res.json({code: 0, msg: '编辑成功', url: '/admin/nav'});
                }catch(err) {
                    console.log('菜单更新失败', err)
                    return res.json({code: -1, msg: err, type: 'NAV_UPDATE_FAILED'});
                }
            })
        }
    }
    async del(req, res) {
        try{
            const _id = req.params.id;
            await NavModel.remove({_id: _id});
            return res.json({code: 0, msg: '删除成功', url: '/admin/nav'});
        }catch(err) {
            console.log('菜单删除失败', err);
            return res.json({code: -1, msg: err, type: 'NAV_DEL_FAILED'});
        }
    }
}

export default new Nav()