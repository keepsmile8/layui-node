import express from 'express'
import Plugins from '../controller/plugins'

const router = express.Router()

router.get('/Ueditor/node/controller', Plugins.config)
router.post('/Ueditor/node/controller', Plugins.uploadimage)


export default router
