import express from 'express'
import taskController from '../controllers/task.controller.js'
const router = express.Router();

router.post('/task',taskController.addTask);
router.get('/tasks/:userId', taskController.getTasks);
router.put('/tasks/:taskId', taskController.editTask);
router.delete('/tasks/:taskId',taskController.deleteTask);
router.patch('/tasks/:taskId/done', taskController.markTaskAsDone); 

export default router;