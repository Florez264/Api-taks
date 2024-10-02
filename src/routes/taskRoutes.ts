import express from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';

const router = express.Router();
const taskController = new TaskController();

router.use(authMiddleware as express.RequestHandler);

// Rutas de tareas
router.post('/', (req: AuthRequest, res) => taskController.createTask(req, res));
router.get('/list', (req: AuthRequest, res) => taskController.getTasks(req, res));
router.get('/:taskId', (req: AuthRequest, res) => taskController.getTaskById(req, res));


// Actualizar y eliminar tareas
router.patch('/update-task/:taskId', (req: AuthRequest, res) => taskController.updateTask(req, res));
router.delete('/delete-task/:taskId', (req: AuthRequest, res) => taskController.deleteTask(req, res));

// Agregar y eliminar personas de las tareas
router.post('/:taskId/persons', (req: AuthRequest, res) => taskController.addPerson(req, res));
router.delete('/delete-persona/:taskId/persons/:personId', (req: AuthRequest, res) => taskController.removePerson(req, res));

// Actualizar el estado de una persona en una tarea
router.patch('/:taskId/persons/:personId/status', (req: AuthRequest, res) => taskController.updatePersonStatus(req, res));

// Agregar y actualizar habilidades de personas
router.post('/:taskId/persons/:personId/skills', (req: AuthRequest, res) => taskController.addSkill(req, res));
router.patch('/:taskId/persons/:personId/skills', (req: AuthRequest, res) => taskController.updateSkill(req, res));

// Exportar las rutas
export default router;
