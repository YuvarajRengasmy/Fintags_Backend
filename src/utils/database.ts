"use strict";
import * as mongoose from 'mongoose';
import * as config from '../config';
import { User } from '../model/user.model';

export class mongoconnect {
    connectToDb(): any {
        try {
            mongoose.set("debug", true);
            mongoose.set('strictQuery', true);
            mongoose.connect(config.SERVER.MONGODB_URL);
            console.info("Connect to Database");
            var db = mongoose.connection;
            db.on("error", console.error.bind(console, "connection error:"));
            db.once("open", function () {
                var fs = require("fs"),
                    obj;

                fs.readFile("./src/upload/user.json", handleFileUser);

                async function handleFileUser(err, data) {
                    if (err) throw err
                    obj = JSON.parse(data)
                    const count = await User.find().countDocuments()
                    if (count === 0) {
                        User.collection.insertMany(obj).then(function () {
                            console.log("Multiple documents inserted to Collection");
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                }
            });
        } catch (err) {
            console.error("Connection error" + err);
        }
    }
}