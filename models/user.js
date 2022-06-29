'use strict';
const {hash} = require('../helpers/bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.News, {foreignKey:'AuthorId'})
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique:{
        args:true,
        msg:'Email must be unique'
      },
      validate: {
        notEmpty: {
          msg:'username is required'
        },
        isEmail: {
          args: true,
          msg:"Your email format isn't right!"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg:"Password is required"
        },
        lengthIsGood(value) {
          if(value.length < 5) {
            throw new Error("Minimum password character is 5")
          }
        }
      }
    },
    role: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    // hooks:{
    //   beforeCreate(ins, opt) {
    //     ins.password = hash(ins.password)
    //   }
    // },
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((ins, options) => {
    ins.password = hash(ins.password)
  })
  User.beforeBulkCreate((ins, option) => {
    ins.forEach(el => {
      el.password = hash(el.password)
    })
  })
  return User;
};