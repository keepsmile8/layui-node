import express from 'express'
import Admin from '../controller/admin'
import Login from '../controller/login'

const router = express.Router()

router.get('/', Admin.checkLogin, Login.login);
router.post('/', Admin.checkLogin, Login.login);

export default router
