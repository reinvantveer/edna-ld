const process = require('process');
const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const uiRoutes = require('./routes/ui');
const apiRoutes = require('./routes/api');
const socketIORoutes = require('./routes/socket.io');

socketIORoutes(io)
  .then(() => {
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(favicon());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', uiRoutes);
    app.use('/api/v1', apiRoutes);

    // catch 404 and forwarding to error handler
    app.use((req, res, next) => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
      app.use((err, req, res) => {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err,
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use((err, req, res) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
      });
    });
  })
  .catch(err => {
    if (err.message.indexOf('failed to connect to server') > -1) {
      console.error(err.message);
      console.error('Please start a mongodb instance on the supplied host and port first.');
      return process.exit(-1);
    }
    console.error(err.stack);
    return process.exit(-1);
  });


module.exports = { app, server };
