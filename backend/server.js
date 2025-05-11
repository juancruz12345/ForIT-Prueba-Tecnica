import express from 'express'
import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 3000;


if (!process.env.DB_URL || !process.env.DB_TOKEN) {
    throw new Error("Missing environment variables");
  }


const db = createClient({
    url:process.env.DB_URL,
    authToken: process.env.DB_TOKEN
})



app.get('/api/task', async(req,res)=>{

    try{

        const tasks = await db.execute('SELECT * FROM tasks')
      
        res.json(tasks.rows)
    }catch(e){
        res.status(500).json({ error: e.message})
    }

})

app.post('/api/task', async(req,res)=>{
    const {title,description} = req?.body

    
    try{

        if (!title || !description) {
            return res.status(400).json({ error: 'El titulo y descripcion de la tarea son requeridos' });
          }

        const taskExist = await db.execute({
            sql:'SELECT title FROM tasks WHERE title = :title',
            args: {title}
         })
         if(taskExist.rows.length>0){
    
            throw new Error('Ya existe una tarea con ese titulo.')
        }
        
        const result = await db.execute(
            `INSERT INTO tasks (title, description) VALUES (?,?)`,
             [title,description]

            )
   console.log(result)
        res.status(200).json({ message: 'Tarea agregada correctamente' })

    }catch(e){
        res.status(500).json({ error: e.message})
    }

})


app.put('/api/task/:id', async(req,res)=>{

  const {title, description,completed} = req?.body
  const {id} = req?.params

   if(!id){
    throw new Error('Es necesario el id de la tarea')
  }

const updates = []
const params = []


if (title !== undefined) {
  updates.push('title = ?')
  params.push(title)
}

if (description !== undefined) {
  updates.push('description = ?')
  params.push(description)
}
if (completed  !== undefined) {

  updates.push('completed = ?')
  params.push(completed)
}

if (updates.length > 0){
   params.push(id)

   const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`
    const result = await db.execute(query, params)
}else {
 
  console.log('No se proporcionaron campos para actualizar')
}

 
  try{
    const taskExist = await db.execute(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
   )
   
   if(!taskExist.rows.length>0){
    
    throw new Error('No existe una tarea con ese id.')
   }

   const updates = []
const params = []


if (title !== undefined) {
  updates.push('title = ?')
  params.push(title)
}

if (description !== undefined) {
  updates.push('description = ?')
  params.push(description)
}

if (updates.length > 0){
   params.push(id)

   const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`
  const result = await db.execute(query, params)
   console.log(result)
   res.status(200).json({ message: 'Usuario actualizado correctamente.' })
}else {
 
  console.log('No se proporcionaron campos para actualizar')
}
   

  }catch(e){
    res.status(500).json({ error: e.message})
  }


})

app.delete('/api/task/:id', async(req,res)=>{

  const {id} = req?.params

  if(!id){
    throw new Error('El id de la tarea es requerido')
  }
  try{

    const taskExist = await db.execute('SELECT * FROM tasks WHERE id = ?',[id])
    if(!taskExist.rows.length>0){
    
    throw new Error('No existe una tarea con ese id')
   }

   const result = await db.execute('DELETE FROM tasks WHERE id = ?',[id])
   console.log(result)
   res.status(200).json({ message: 'Tarea borrada correctamente.' })


  }catch(e){
    res.status(500).json({ error: e.message})
  }
    
})




app.listen(PORT, () => console.log(`Servidor en ${PORT}`))