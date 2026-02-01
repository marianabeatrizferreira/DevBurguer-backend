import { Router } from 'express';
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import ProductController from './app/controllers/ProductController.js';
import multer from 'multer';
import  CreatePaymentIntentController from './app/controllers/stripe/CreatePaymentIntentController.js'
import multerConfig from './config/multer.cjs';
import authMiddlewar from './app/middlewares/auth.js';
import Categorycontroller from './app/controllers/Categorycontroller.js';
import adminMiddlewar from './app/middlewares/admin.js';
import OrderController from './app/controllers/OrderController.js';
import { getDeliveryTax } from './app/controllers/deliverycontroller.js';
import { getAddressSuggestions } from './app/controllers/adressController.js';
import { createPix } from './app/controllers/pixController.js';


const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store );

routes.use(authMiddlewar);

routes.post('/products',
     adminMiddlewar, upload.single('file')
      , ProductController.store);

 routes.put('/products/:id',
     adminMiddlewar, upload.single('file')
      , ProductController.update);

 routes.delete('/products/:id', adminMiddlewar, ProductController.deleteProduct)

routes.get('/products', ProductController.index);

routes.post('/categories',
     adminMiddlewar, upload.single('file'),
      Categorycontroller.store);
routes.delete('/categories/:id',
     adminMiddlewar,
       Categorycontroller.deleteCategory);



routes.get('/categories', Categorycontroller.index);

routes.post('/orders',
     OrderController.store
      );

      routes.put('/orders/:id',
     adminMiddlewar,
     OrderController.update);

     routes.get('/orders', OrderController.index);

routes.post('/create-payment-intent', CreatePaymentIntentController.store)

routes.post("/delivery-tax", getDeliveryTax);
routes.get('/address-suggestions', getAddressSuggestions)
routes.post("/create-pix-payment", createPix);



export default routes;

