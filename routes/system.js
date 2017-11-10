import express from 'express'
import System from '../controller/System'
import Admin from '../controller/admin'

const router = express.Router()

router.get('/website', Admin.checkAuth, System.index);
router.post('/website', Admin.checkAuth, System.index);

router.get('/install', Admin.checkInstall, System.install);
router.post('/install', Admin.checkInstall, System.install);

export default router


