 const Product = require('../models/product');
// const Cart = require('../models/cart');
// const mongo = require("mongodb");
// const obj = mongo.ObjectID;
const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../models/order");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
//const user = require("../models/users");
const nodemailer = require('nodemailer');
const {validationResult} = require("express-validator/check");

let mailTransporter = nodemailer.createTransport({ 
  service: 'gmail', 
  auth: { 
      user: 'l0stt3chi3@gmail.com', 
      pass: 'iamarealhunter11'
  } 
}); 
const ITEMS_PER_PAGE = 1;



exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false,
    isAuthenticated:req.session.isLoggedIn,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

// exports.postAddProduct = (req, res, next) => {
//   const title = req.body.title;
//   const image = req.file;
//   const price = req.body.price;
//   const description = req.body.description;
//   if(!image){
//     return res.status(422).render('admin/edit-product', {
//       pageTitle: 'Add Product',
//       path: '/admin/edit-product',
//       editing: false,
//       hasError: true,
//       product: {
//         title: title,
//         price: price,
//         description: description
//       },
//       errorMessage: 'Attached file is not an image',
//       validationErrors: []
//     });
//   }


  

//   const errors = validationResult(req);
  
    
//   if (!errors.isEmpty()) {
//     console.log(errors.array());
//     return res.status(422).render('admin/edit-product', {
//       pageTitle: 'Add Product',
//       path: '/admin/edit-product',
//       editing: false,
//       hasError: true,
//       product: {
//         title: title,
//         imageUrl: image,
//         price: price,
//         description: description
//       },
//       errorMessage: errors.array()[0].msg,
//       validationErrors: errors.array()
//     });
//   }
//   const imageUrl= image.path;


//   const product = new Product({title:title,price:price,description:description,imageUrl:imageUrl,userId:req.user});
//   product.save()
//    .then(result => {
    
//      res.redirect('/');
//    })
//    .catch(err => {
//      console.log("errorfound");
//    })
  
// };
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  console.log(image);
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);
  const imageUrl = image.path;

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  

  const product = new Product({
    // _id: new mongoose.Types.ObjectId('5badf72403fd8b5be0366e81'),
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   errorMessage: 'Database operation failed, please try again.',
      //   validationErrors: []
      // });
      console.log("error fopund");
    });
};






// exports.getProducts = (req, res, next) => {
//   Product.find({userId:req.user._id})
//     .then(products => {
//       console.log(products);
//       res.render('shop/product-list', {
//         prods: products,
//         pageTitle: 'All Products',
//         path: '/products',
//         isAuthenticated:req.session.isLoggedIn
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };


exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      console.log("error");
    });
};


  exports.adminProductss = (req, res, next) => {
    Product.find() 
     .then(result => {
      res.render('admin/products', {
        prods: result,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated:req.session.isLoggedIn
      });
     })
     .catch(err => {
       console.log("error found");
     })
    
};
    

exports.getProduct = (req,res,next)=>{
  const prodId = req.params.productID;
  Product.findById(prodId)
   .then(result => {
        const fr = result._id;
        const err = mongoose.Types.ObjectId(fr);
        res.render("shop/product-detail",{
        product:result,
        pageTitle:"specific",
        prodd:err,
        desc:result.description,
        url:result.imageUrl,
        path:"/products",
        isAuthenticated:req.session.isLoggedIn
      })
   })
   .catch(err => {
     console.log(err);
   })
 
}


 

// exports.getIndex = (req, res, next) => {
//   const page = req.query.page;
//   Product.find()
//   .skip((page - 1) * ITEMS_PER_PAGE)
//   .limit(ITEMS_PER_PAGE)
//   .then(products => {
//     res.render('shop/index', {
//       prods: products,
//       pageTitle: 'Shop',
//       path: '/'
//     });
//   })
//   .catch(err => {
//     console.log(err);
//   })
// };
exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      console.log("error");
    });
};

exports.adminProductss = (req, res, next) => {
  Product.find() 
   .then(result => {
    res.render('admin/products', {
      prods: result,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated:req.session.isLoggedIn
    });
   })
   .catch(err => {
     console.log("error found");
   })
  
};







exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    // Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated:req.session.isLoggedIn,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => console.log(err));
};

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;





//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(422).render('admin/edit-product', {
//       pageTitle: 'Edit Product',
//       path: '/admin/edit-product',
//       editing: true,
//       hasError: true,
//       product: {
//         title: updatedTitle,
//         imageUrl: updatedImageUrl,
//         price: updatedPrice,
//         description: updatedDesc,
//         _id: prodId
//       },
//       errorMessage: errors.array()[0].msg,
//       validationErrors: errors.array()
//     });
//   }

//   Product.findById(prodId)
//     .then(product => {
//       if (product.userId.toString() !== req.user._id.toString()) {
//         return res.redirect('/');
//       }
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.description = updatedDesc;
//       product.imageUrl = updatedImageUrl;
//       return product.save().then(result => {
//         console.log('UPDATED PRODUCT!');
//         res.redirect('/admin/products');
//       });
//     })
//     .catch(err => console.log(err));
// };





exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) {
        product.imageUrl = image.path;
      }
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      });
    })
    .catch(err => {
      console.log("error");
    });
};

exports.postDeleteProduct = (req,res,next) => {

  const id = req.params.productId;
  Product.deleteOne({ _id: id, userId: req.user._id })
   .then(() => {
     console.log("deleted");
     res.status(200).json({message:"deleted product"});
   })
   .catch(() => {
     console.log("err");
     res.status(500).json({message:"not deleted product"});
   })
  
 }
 exports.postCart = (req, res, next) => {
  const prodId = req.body.inputID;

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated:req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};



// 223


exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};


// exports.getAuth = (req, res, next) => {
//   let message = req.flash('error');
//   if(message.length > 0){
//     message = message[0];
//   }else{
//     message = null;
//   }
//   res.render('admin/auth', {
//     path: '/login',
//     pageTitle: 'Login',
//     errorMessage:message
//   });
// };
exports.getAuth = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/auth', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

// exports.postAuth = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   User.findOne({ email: email })
//     .then(user => {
//       if (!user) {
//         req.flash('error','Invalid email or password');
//         return res.redirect('/login');
//       }
//       bcrypt
//         .compare(password, user.password)
//         .then(doMatch => {
//           if (doMatch) {
//             req.session.isLoggedIn = true;
//             req.session.user = user;
//             return req.session.save(err => {
//               console.log(err);
//               res.redirect('/');
//             });
//           }
//           req.flash('error','Invalid email or password');
//           res.redirect('/login');
//         })
//         .catch(err => {
//           console.log(err);
//           res.redirect('/login');
//         });
//     })
//     .catch(err => console.log(err));
// };

exports.postAuth = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/auth', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: []
    });
  }




  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('admin/auth', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

// exports.postOrder = (req, res, next) => {
//   req.user
//     .populate('cart.items.productId')
//     .execPopulate()
//     .then(user => {
//       const products = user.cart.items.map(i => {
//         return { quantity: i.quantity, product: { ...i.productId._doc } };
//       });
//       const order = new Order({
//         user: {
//           name: req.user.name,
//           userId: req.user
//         },
//         products: products
//       });
//       return order.save();
//     })
//     .then(result => {
//       return req.user.clearCart();
//     })
//     .then(() => {
//       res.redirect('/orders');
//     })
//     .catch(err => console.log(err));
// };

// exports.getOrders = (req, res, next) => {
//   Order.find({ 'user.userId': req.user._id })
//     .then(orders => {
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//         orders: orders
//       });
//     })
//     .catch(err => console.log(err));
// };


exports.logOut = (req,res,next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  })
  
  
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  const errors = validationResult(req);
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('admin/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage:message,
    oldInput:{
      email:"",
      password:"",
      confirmPassword:""
    },
    validationErrors:[]
  });
};


// exports.postSignup = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const confirmPassword = req.body.confirmPassword;
//   const errors = validationResult(req);
//   if(!errors.isEmpty()){
//     console.log(errors);
//     return res.status(422).render('admin/signup', {
//       path: '/signup',
//       pageTitle: 'Signup',
//       errorMessage:errors.array()[0].msg
//     });

    
//   }
  
//       return bcrypt
//         .hash(password, 12)
//         .then(hashedPassword => {
//           const user = new User({
//             email: email,
//             password: hashedPassword,
//             cart: { items: [] }
//           })
//            return user.save();
//         })
//         .then(result => {
//           res.redirect('/login');
//           let mailDetails = { 
//             from: 'l0st@gmail.com', 
//             to: email, 
//             subject: 'Test mail', 
//             text: 'chutiya hai tu,chutiya hi rahegi'
//           }
//           mailTransporter.sendMail(mailDetails, function(err, data) { 
//             if(err) { 
//                 console.log(err); 
//             } else { 
//                 console.log('Email sent successfully'); 
//             } 
//           });

//         )};
        
      
  
//     .catch(err => {
//       console.log(err);
//     });
// }
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email:email,
        password:password,
        confirmPassword:req.body.confirmPassword
      },
      validationErrors:errors.array()
    });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
      // return transporter.sendMail({
      //   to: email,
      //   from: 'shop@node-complete.com',
      //   subject: 'Signup succeeded!',
      //   html: '<h1>You successfully signed up!</h1>'
      // });
      
          let mailDetails = { 
            from: 'l0st@gmail.com', 
            to: email, 
            subject: 'Test mail', 
            text: 'chutiya hai tu,chutiya hi rahegi'
          }
          mailTransporter.sendMail(mailDetails, function(err, data) { 
            if(err) { 
                console.log(err); 
            } else { 
                console.log('Email sent successfully'); 
            } 
          });
    })
    .catch(err => {
      console.log(err);
    });
};


















exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('admin/reset', {
    path: '/reset',
    pageTitle: 'Reset password',
    errorMessage:message
  });
};        





exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        // transporter.sendMail({
        //   to: req.body.email,
        //   from: 'shop@node-complete.com',
        //   subject: 'Password reset',
        //   html: `
        //     <p>You requested a password reset</p>
        //     <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        //   `
        // });
        let mailDetails = { 
          from: 'l0st@gmail.com', 
          to: req.body.email, 
          subject: 'Test mail', 
          text: 'chutiya hai tu,chutiya hi rahegi',
          html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:2000/reset/${token}">link</a> to set a new password.</p>
             `

        }
        mailTransporter.sendMail(mailDetails, function(err, data) { 
          if(err) { 
              console.log(err); 
          } else { 
              console.log('Email sent successfully'); 
          } 
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};




exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('admin/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
};