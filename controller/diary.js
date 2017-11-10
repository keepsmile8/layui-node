import Base from './base'
import formidable from 'formidable'
import DiaryModel from '../models/diary'

class Diary extends Base{
    constructor() {
        super();
        this.write = this.write.bind(this);
    }
    list(req, res) {
        if(req.method == 'GET') {
            return res.render('diary/index');
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                const {pageIndex, pageSize} = fields;
                try{
                    const diarySum = await DiaryModel.find({});
                    const diary = await DiaryModel.find({}).populate('author').sort({ createtime: -1 }).skip(Number( (pageIndex-1)*pageSize )).limit(Number(pageSize));
                    return res.json({code: 0, msg: '获取成功', list: diary, count: diarySum.length});
                }catch(err) {
                    console.log('获取文章列表失败', err);
                    return res.json({code: 0, msg: err, type: 'DIARY_GET_FAILED'});
                }
                
            })
        }
    }
    write(req, res) {
        if(req.method == 'GET') {
            res.render('diary/write');
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {title, editorValue} = fields;
                    const author = req.session.user._id;
                    const data = {author: author, title: title, body: editorValue, createtime: this.moment().format('YYYY-MM-DD HH:mm')};
                    await DiaryModel.create(data)
                    return res.json({code: 0, msg: '发表成功', url: '/admin/diary'});
                }catch(err) {
                    console.log('文章发表失败', err);
                    return res.json({code: -1, msg: err, type: 'DIARY_SAVE_FAILED'});
                }
            })
        }
    }
    async edit(req, res) {
        if(req.method == 'GET') {
            try{
                const _id =  req.params.id;
                const diary = await DiaryModel.findOne({_id: _id});
                return res.render('diary/edit', {data: diary});
            }catch(err) {
                console.log('获取待编辑文章失败', err);
                return res.json({code: -1, msg: err, type: 'DIARY_FIND_FAILED'});
            }
        }else if(req.method == 'POST') {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                try{
                    const {_id, title, editorValue} = fields;
                    await DiaryModel.update({_id: _id}, {title: title, body: editorValue});
                    return res.json({code: 0, msg: '更新成功', url: '/admin/diary/edit/' + _id});
                }catch(err) {
                    console.log('更新文章失败', err);
                    return res.json({code: -1, msg: err, type: 'DIARY_SAVE_FAILED'});
                }
               
            })
        }
    }
    async read(req, res) {
        try{
            const _id = req.params.id;
            const diray = await DiaryModel.findOne({_id: _id});
            return res.render('diary/read', {data: diray});
        }catch(err) {
            console.log('查询文章失败', err);
            return res.json({code: -1, msg: err, type: 'DIARY_FIND_FAILED'});
        }
        
    }
    async del(req, res) {
        try{
            const _id = req.params.id;
            await DiaryModel.remove({_id: _id});
            return res.json({code: 0, msg: '删除成功', url: '/admin/diary'})
        }catch(err) {
            console.log('删除文章失败', err);
            return res.json({code: -1, msg: err, type: 'DIARY_DEL_FAILED'});
        }
    }
}

export default new Diary()