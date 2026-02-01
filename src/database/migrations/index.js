import {  Sequelize } from 'sequelize';
import mongoose, { Mongoose } from 'mongoose';
import databaseConfig from '../../config/database.cjs';
import User from '../../app/models/User.js';
import Product from '../../app/models/Product.js';
import Category from '../../app/models/category.js';

const models = [User, Product, Category];



class Database {
    constructor(){
        this.init();
        this.mongo();
    }

    init(){
        this.connection = new Sequelize(databaseConfig)
        models.map((Model) => Model.init(this.connection)).map(model => model.associate && model.associate(this.connection.models) );
    }

    mongo(){
        this.mongooseConnection = mongoose.connect('mongodb://localhost:27017/devburguer')
    }
}

export default new Database();