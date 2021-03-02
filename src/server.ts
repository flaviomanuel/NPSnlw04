import express from 'express';

const app = express()

/**
 * GET => Buscar
 * POST => Salvar
 * PUT => Editar
 * DELETE => Deletar
 * PATCH => Alteração específica
 * 
 **/

//http://localhost:333/users
 app.get('/users', (request, response) => {
     return response.json({ message: "Hello world!"})
 })

 // 1 paramentro => rota
 // 2 parametro => request, response
 app.post("/", (request, response) => {
     return response.json({message: "os dados foram salvos"})
 })
 
app.listen(3333, () => console.log('Server correndo!')) 