import rf from 'fs'
import path from 'path'
import moment from 'moment'
import formidable from 'formidable'

class Plugin{
    constructor() {
        this.config = this.config.bind(this)
    }
    config(req, res) {
        const file = path.normalize(__dirname + '/../public/plugins/Ueditor/node/config.json');
        try{
            rf.readFile(file, 'utf-8', (err,data) => {  
                if(err){  
                    throw err;  
                }else{
                    const str = data.replace(/.*?\/\*[\s\S]+?\*\/.*?/, "");
                    req.session.ueconfig = str;  
                    return res.send(data); 
                }  
            });
        }catch(err) {
            console.log('获取配置文件失败', err);
            return res.json({code: -1, msg: err, type: 'CONFIG_GET_FAILED'});
        }
          
    }
    uploadimage(req, res) {
        const config = JSON.parse(req.session.ueconfig);
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            try{
                const tmp_path = files.upfile.path;
                const dir = moment().format('YYYYMMDD')
                const _path = path.normalize(__dirname + '/../public/upload/'+ dir + '/') ;
                if (!rf.existsSync(_path)) {
                    rf.mkdirSync(_path);
                }
                const target_path = _path + files.upfile.name;
                rf.rename(tmp_path, target_path, function(err) {
                    if (err) throw err; 
                    rf.unlink(tmp_path, function() {
                        if (err) throw err;
                        return res.json({state: "SUCCESS", url: '/upload/' + dir + '/' + files.upfile.name, title: files.upfile.name, size: files.upfile.size});
                    });
                });
            }catch(err) {
                console.log('图片删除失败', err);
                return res.json({code: -1, msg: err, type: 'IMG_UPLOAD_FAILED'});
            }
        })        
    }
}

export default new Plugin()