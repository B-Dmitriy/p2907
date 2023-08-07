import express from 'express';
import { todoController } from '../controllers/todosController';

const router = express.Router();
/**
* @openapi
*
* /: 
*        get: 
*          description: "test"
*            responses: 
*                "200": 
*                    description: "test 200"
*                
*            
*        
*    
*/
router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.get('/:todoId', todoController.getTodoById);
router.put('/:todoId', todoController.updateTodo);
router.delete('/:todoId', todoController.deleteTodo);

export const todosRouter = router;