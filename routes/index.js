'use strict';

import login from './login'
import admin from './admin'
import system from './system'
import plugins from './plugins'

module.exports = app => {
	app.use('/login', login);
	app.use('/admin', admin);
    app.use('/', admin);
	app.use('/system', system);
	app.use('/plugins', plugins);
	app.get('/noauth', (req, res, next) => { return res.render('noauth') });
	app.use('/main', (req, res, next) => { return res.render('main') });
	app.use((req, res) => { if(!res.headersSent) res.status(404).render('404') });
}