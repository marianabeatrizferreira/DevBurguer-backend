import * as yup from 'yup';

import Category from './../models/category.js'


class Categorycontroller{
    async store(request, response) {
        const schema = yup.object({
            name: yup.string().required(),
            
        });

          try {
       schema.validateSync(request.body, { abortEarly: false});
       } catch(err) {
        console.log(err);
        return response.status(400).json({ error: err.errors});
       }
    
     
       const {name} = request.body;
       const { filename } = request.file;

       const existingCategory = await Category.findOne({
        where: {
            name
        }
       });

       if (existingCategory){
        return response.status(400).json({ error: "category already exists"})
       };
       
     
       const newCategory = await Category.create({
          name,
            path: filename
          
       })

        return response.status(201).json(
            { newCategory }
        )

    }

  
  
    async update(request, response) {
        const schema = yup.object({
            name: yup.string(),
            
        });

          try {
       schema.validateSync(request.body, { abortEarly: false});
       } catch(err) {
        console.log(err);
        return response.status(400).json({ error: err.errors});
       }
    
     
       const {name} = request.body;
       const { id } = request.params

       let path
       if (request.file){
           const { filename } = request.file;
           path = filename

       }
      
       const existingCategory = await Category.findOne({
        where: {
            name
        }
       });

       if (existingCategory){
        return response.status(400).json({ error: "category already exists"})
       };
       
     
       await Category.update(
        {
        name,
        path,},
         {
            where: {
                id,
            }
        });

       
        return response.status(201).json("updated category!")
       
    
    }

async index(_request, response){
        
        const categories = await Category.findAll();

     

        return response.status(200).json(categories)
    }

    async  deleteCategory(request, response) {
  try {
    const { id } = request.params

    if (!id || Number.isNaN(Number(id))) {
      return response.status(400).json({ message: 'ID inválido' })
    }

    const category = await Category.findByPk(id)

    if (!category) {
      return response.status(404).json({ message: 'Categoria não encontrada' })
    }

    await category.destroy()

    return response.status(200).json({
      message: 'Categoria deletada com sucesso',
    })
  } catch (error) {
    console.error('deleteCategory:', error)
    return response.status(500).json({
      message: 'Erro interno do servidor',
    })
  }
}
}
export default new Categorycontroller();