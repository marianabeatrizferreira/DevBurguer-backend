
import Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/category.js';
import Order from '../schemas/Order.js';

class OrderController{
    async store(request, response) {
  const schema = Yup.object({
    products: Yup.array()
      .required()
      .of(
        Yup.object({
          id: Yup.number().required(),
          quantity: Yup.number().required(),
        })
      ),

   
    address: Yup.string().required().min(8),


    deliveryTax: Yup.number().nullable(),
    km: Yup.number().nullable(),
    etaMinutes: Yup.number().nullable(),
  });

  try {
    schema.validateSync(request.body, { abortEarly: false, strict: true });
  } catch (err) {
    return response.status(400).json({ error: err.errors });
  }

  const { userId, userName } = request;
  const { products, address, deliveryTax, km, etaMinutes } = request.body;

  const productsIds = products.map((p) => p.id);

  const findedProducts = await Product.findAll({
    where: {
      id: productsIds,
    },
    include: {
      model: Category,
      as: "category",
      attributes: ["name"],
    },
  });

  const mapedProducts = findedProducts.map((product) => {
    const quantity = products.find((p) => p.id === product.id)?.quantity || 0;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      url: product.url,
      category: product.category?.name ?? "sem categoria",
      quantity,
    };
  });

  const order = {
    user: {
      id: userId,
      name: userName,
    },
    products: mapedProducts,
    status: "pedido realizado!",

    address,

   
    delivery: {
      deliveryTax: deliveryTax ?? null,
      km: km ?? null,
      etaMinutes: etaMinutes ?? null,
    },
  };

  const newOrder = await Order.create(order);

  return response.status(201).json(newOrder);
}


    async update(request, response) {
      const schema = Yup.object({
          status: Yup.string().required()
          
        });

          try {
       schema.validateSync(request.body, { abortEarly: false, strict: true});
       } catch(err) {
        console.log(err);
        return response.status(400).json({ error: err.errors});
       }

       const { status } = request.body;
       const { id } = request.params;

       try {
         await Order.updateOne({ _id: id }, { status })
       } catch (err) {
        return response.status(400).json({ error: err.message })
       }
      

       return response.status(200).json({ message: "Status updated sucessfully" })
    }

    async index(_request, response) {
      const orders = await Order.find()

      return response.status(200).json(orders)
    }

       
}

export default new OrderController();