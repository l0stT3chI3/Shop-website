const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const productSchema = new Schema({
    title:{
      type:String,
      required:true
    },

    price:{
      type:Number,
      required:true
    },
    
    description:{
      type:String,
      required:true
    },

    imageUrl:{
      type:String,
      required:true
    },

    userId:{
      type:Schema.Types.ObjectId,
      ref:"User",
      required:true
    }
})

module.exports = mongoose.model("Product",productSchema);














// // const fs = require('fs');
// // const path = require('path');
// // const Cart = require('./c// const fs = require('fs');
// // const path = require('path');
// // const Cart = require('./cart');
// const mong = require("mongodb");
// // const p = path.join(
// //   path.dirname(process.mainModule.filename),
// //   'data',
// //   'products.json'
// // );

// // const getProductsFromFile = cb => {
// //   fs.readFile(p, (err, fileContent) => {
// //     if (err) {
// //       cb([]);
// //     } else {
// //       cb(JSON.parse(fileContent));
// //     }
// //   });
// // };

// // module.exports = class Product {
// //   constructor(id,title, imageURL, description, price) {
// //     this.id = id;
// //     this.title = title;
// //     this.imageURL = imageURL;
// //     this.description = description;
// //     this.price = price;
// //   }

// //   save() {
// //     getProductsFromFile(products => {
// //       if (this.id) {
// //         const existingProductIndex = products.findIndex(
// //           prod => prod.id === this.id
// //         );
// //         const updatedProducts = [...products];
// //         updatedProducts[existingProductIndex] = this;
// //         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
// //           console.log(err);
// //         });
// //       } else {
// //         this.id = Math.random().toString();
// //         products.push(this);
// //         fs.writeFile(p, JSON.stringify(products), err => {
// //           console.log(err);
// //         });
// //       }
// //     });
// //   }

// //   static fetchAll(cb) {
// //     getProductsFromFile(cb);
// //   }

// //   static deleteById(id) {
// //     getProductsFromFile(products => {
// //       const product = products.find(prod => prod.id === id);
// //       const updatedProducts = products.filter(prod => prod.id !== id);
// //       fs.writeFile(p, JSON.stringify(updatedProducts), err => {
// //         if (!err) {
// //           Cart.deleteProduct(id, product.price);
// //         }
// //       });
// //     });
// //   }


// //   static findById(id, cb) {
// //     getProductsFromFile(products => {
// //       const product = products.find(p => p.id === id);
// //       cb(product);
// //     });
// //   }
// // };
// const data = require('../util/database').databases;
// class Product{
//   constructor(title,price,imageUrl,description,id,userId){
//     this.title = title;
//     this.price = price;
//     this.imageUrl= imageUrl;
//     this.description = description;
//     this._id = id;
//     this.userId = userId;
//   }
//   save(){
//     const db = data();
//     let db0p;
//     if(this._id){
//       db0p = db
//         .collection('products')
//         .updateOne({ _id: new mong.ObjectId(this._id) }, { $set: this });
//     }else{
//        db0p = db.collection("products").insertOne(this)
//     }
//     return db0p
//      .then(result =>{
//          console.log(result);
//      })
//      .catch(err => {
//          console.log(err);
//      })
//   }

//   static fetchAll(){
//     const db = data();
//     return db.collection("products").find().toArray()
//      .then(result => {
//        console.log(result);
//        return result;
//      })
//      .catch(err => {
//        throw err;
//      })
//   }

//   static findById(prodId){
//     const db = data();
//     return db.collection("products").find({_id:new mong.ObjectID(prodId)}).next()
//      .then(result =>{
//        return result;
//      })
//      .catch(err => {
//        return err;
//      })
//   } 
//   static deleteById(prodId){
//      const db = data();
//      return db.collection("products").deleteOne({_id: new mong.ObjectID(prodId)})
//       .then(res => {
//         console.log("res");
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }

// }
// // const Product = sequelize.define('product', {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   title: Sequelize.STRING,
// //   price: {
// //     type: Sequelize.DOUBLE,
// //     allowNull: false
// //   },
// //   imageUrl: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   },
// //   description: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   }
// // });

//  module.exports = Product;art');
// const mong = require("mongodb");
// // const p = path.join(
// //   path.dirname(process.mainModule.filename),
// //   'data',
// //   'products.json'
// // );

// // const getProductsFromFile = cb => {
// //   fs.readFile(p, (err, fileContent) => {
// //     if (err) {
// //       cb([]);
// //     } else {
// //       cb(JSON.parse(fileContent));
// //     }
// //   });
// // };

// // module.exports = class Product {
// //   constructor(id,title, imageURL, description, price) {
// //     this.id = id;
// //     this.title = title;
// //     this.imageURL = imageURL;
// //     this.description = description;
// //     this.price = price;
// //   }

// //   save() {
// //     getProductsFromFile(products => {
// //       if (this.id) {
// //         const existingProductIndex = products.findIndex(
// //           prod => prod.id === this.id
// //         );
// //         const updatedProducts = [...products];
// //         updatedProducts[existingProductIndex] = this;
// //         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
// //           console.log(err);
// //         });
// //       } else {
// //         this.id = Math.random().toString();
// //         products.push(this);
// //         fs.writeFile(p, JSON.stringify(products), err => {
// //           console.log(err);
// //         });
// //       }
// //     });
// //   }

// //   static fetchAll(cb) {
// //     getProductsFromFile(cb);
// //   }

// //   static deleteById(id) {
// //     getProductsFromFile(products => {
// //       const product = products.find(prod => prod.id === id);
// //       const updatedProducts = products.filter(prod => prod.id !== id);
// //       fs.writeFile(p, JSON.stringify(updatedProducts), err => {
// //         if (!err) {
// //           Cart.deleteProduct(id, product.price);
// //         }
// //       });
// //     });
// //   }


// //   static findById(id, cb) {
// //     getProductsFromFile(products => {
// //       const product = products.find(p => p.id === id);
// //       cb(product);
// //     });
// //   }
// // };
// const data = require('../util/database').databases;
// class Product{
//   constructor(title,price,imageUrl,description,id,userId){
//     this.title = title;
//     this.price = price;
//     this.imageUrl= imageUrl;
//     this.description = description;
//     this._id = id;
//     this.userId = userId;
//   }
//   save(){
//     const db = data();
//     let db0p;
//     if(this._id){
//       db0p = db
//         .collection('products')
//         .updateOne({ _id: new mong.ObjectId(this._id) }, { $set: this });
//     }else{
//        db0p = db.collection("products").insertOne(this)
//     }
//     return db0p
//      .then(result =>{
//          console.log(result);
//      })
//      .catch(err => {
//          console.log(err);
//      })
//   }

//   static fetchAll(){
//     const db = data();
//     return db.collection("products").find().toArray()
//      .then(result => {
//        console.log(result);
//        return result;
//      })
//      .catch(err => {
//        throw err;
//      })
//   }

//   static findById(prodId){
//     const db = data();
//     return db.collection("products").find({_id:new mong.ObjectID(prodId)}).next()
//      .then(result =>{
//        return result;
//      })
//      .catch(err => {
//        return err;
//      })
//   } 
//   static deleteById(prodId){
//      const db = data();
//      return db.collection("products").deleteOne({_id: new mong.ObjectID(prodId)})
//       .then(res => {
//         console.log("res");
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }

// }
// // const Product = sequelize.define('product', {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   title: Sequelize.STRING,
// //   price: {
// //     type: Sequelize.DOUBLE,
// //     allowNull: false
// //   },
// //   imageUrl: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   },
// //   description: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   }
// // });

//  module.exports = Product;