import * as yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/category.js';
import fs from 'fs'
import path from 'path'

class ProductController{
    async store(request, response) {
        const schema = yup.object({
            name: yup.string().required(),
            price: yup.number().required(),
            category_id: yup.number().integer().required(),
            offer: yup.boolean()
        });

          try {
       schema.validateSync(request.body, { abortEarly: false});
       } catch(err) {
        console.log(err);
        return response.status(400).json({ error: err.errors});
       }

       const {name, price, category_id, offer} = request.body;
       if (!request.file) {
  return response.status(400).json({ error: 'Arquivo é obrigatório' });
}
const { filename } = request.file;

     
       const newProduct = await Product.create({
          name,
          price,
          category_id,
          path: filename,
          offer
       })

        return response.status(201).json(
            { newProduct }
        )

    }
    async update(request, response) {
        const schema = yup.object({
            name: yup.string(),
            price: yup.number(),
            category_id: yup.number().integer(),
            offer: yup.boolean()
        });

          try {
       schema.validateSync(request.body, { abortEarly: false});
       } catch(err) {
        console.log(err);
        return response.status(400).json({ error: err.errors});
       }

       const {name, price, category_id, offer} = request.body;
       const { id } = request.params
       
       let path 
if (request.file) {
  const { filename } = request.file;
  path = filename
}


     
     await Product.update({
          name,
          price,
          category_id,
          path: path,
          offer
       }, {
        where: {
          id
        }
       })

        return response.status(200).json("Updated product!")
        

    }

     async index(_request, response){
        
        try {
    const products = await Product.findAll({
        include: {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
        }
    });
    return response.status(200).json(products);
  } catch (err) {
    console.error(err);
    return response.status(500).json({
      message: 'DB error',
      error: err?.original?.message || err?.message,
    });
  }
       
    }

    
async  deleteProduct(request, response) {
  try {
    const { id } = request.params

    if (!id || Number.isNaN(Number(id))) {
      return response.status(400).json({ message: 'ID inválido' })
    }

    const product = await Product.findByPk(id)

    if (!product) {
      return response.status(404).json({ message: 'Produto não encontrado' })
    }

    // ajuste o nome do campo se necessário
    const imagePath = product.path || null

    await product.destroy()

    if (imagePath) {
      const fullPath = path.resolve(imagePath)
      fs.promises.unlink(fullPath).catch(() => {})
    }

    return response.status(200).json({
      message: 'Produto deletado com sucesso',
    })
  } catch (error) {
    console.error('deleteProduct:', error)
    return response.status(500).json({
      message: 'Erro interno do servidor',
    })
  }

}}
export default new ProductController();
