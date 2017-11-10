import express from 'express'
import Admin from '../controller/admin'
import User from '../controller/user'
import Group from '../controller/group'
import Auth from '../controller/auth'
import Diary from '../controller/diary'
import Nav from '../controller/nav'
import Login from '../controller/login'

const router = express.Router()

router.get('/', Admin.checkAuth, Admin.show)
router.get('/user/common', Admin.checkAuth, User.list)
router.post('/user/common', Admin.checkAuth, User.list)
router.get('/user/add', Admin.checkAuth, User.add)
router.post('/user/add', Admin.checkAuth, User.add)
router.get('/user/edit/:id', Admin.checkAuth, User.edit)
router.post('/user/edit', Admin.checkAuth, User.edit)
router.get('/user/del/:id', Admin.checkAuth, User.del)

router.get('/group', Admin.checkAuth, Group.list)
router.post('/group', Admin.checkAuth, Group.list)
router.get('/group/add', Admin.checkAuth, Group.add)
router.post('/group/add', Admin.checkAuth, Group.add)
router.get('/group/edit/:id', Admin.checkAuth, Group.edit)
router.post('/group/edit', Admin.checkAuth, Group.edit)
router.get('/group/del/:id', Admin.checkAuth, Group.del)
router.get('/group/auth/:id', Admin.checkAuth, Group.auth)
router.post('/group/auth', Admin.checkAuth, Group.auth)
router.post('/group/getJson', Admin.checkAuth, Group.getJson)
router.post('/group/updaterule', Admin.checkAuth, Group.updateRule)

router.get('/auth', Admin.checkAuth, Auth.list)
router.post('/auth', Admin.checkAuth, Auth.list)
router.get('/auth/add', Admin.checkAuth, Auth.add)
router.post('/auth/add', Admin.checkAuth, Auth.add)
router.get('/auth/edit/:id', Admin.checkAuth, Auth.edit)
router.post('/auth/edit', Admin.checkAuth, Auth.edit)
router.get('/auth/del/:id', Admin.checkAuth, Auth.del)

router.get('/diary', Admin.checkAuth, Diary.list)
router.post('/diary', Admin.checkAuth, Diary.list)
router.get('/diary/write', Admin.checkAuth, Diary.write)
router.post('/diary/write', Admin.checkAuth, Diary.write)
router.get('/diary/read/:id', Admin.checkAuth, Diary.read)
router.get('/diary/edit/:id', Admin.checkAuth, Diary.edit)
router.post('/diary/edit', Admin.checkAuth, Diary.edit)
router.get('/diary/del/:id', Admin.checkAuth, Diary.del)

router.get('/nav', Admin.checkAuth, Nav.list)
router.post('/nav', Admin.checkAuth, Nav.list)
router.get('/nav/add', Admin.checkAuth, Nav.add)
router.post('/nav/add', Admin.checkAuth, Nav.add)
router.get('/nav/edit/:id', Admin.checkAuth, Nav.edit)
router.post('/nav/edit', Admin.checkAuth, Nav.edit)
router.get('/nav/del/:id', Admin.checkAuth, Nav.del)

router.get('/loginout', Login.loginout);

export default router
