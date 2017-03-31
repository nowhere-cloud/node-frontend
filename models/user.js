'use strict';

const passportLocalSequelize = require('passport-local-sequelize');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    hash: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // associations is not used on fr
        // User.hasMany(models.vm_user);
        // User.hasMany(models.dns_record);
        // User.hasMany(models.Task);
      }
    }
  });

  passportLocalSequelize.attachToUser(User, {
    usernameField: 'username',
    hashField: 'hash',
    saltField: 'salt'
  });

  return User;
};
