import prisma from '../lib/prisma.js';


const addTask = async (req, res) => {
  const { title, description, userId, priority } = req.body;

  try {
    const task = await prisma.task.create({
      data: { title, description, userId, priority },  // No default priority
    });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  const { userId } = req.params;
  const { search, priority, completed } = req.query;

 
  const isCompletedFilter = completed ? completed === 'true' : undefined;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          priority ? { priority } : {},  
          isCompletedFilter !== undefined ? { isCompleted: isCompletedFilter } : {},
        ],
      },
    });


    if (tasks.length === 0) {
      return res.json({ success: true, message: 'No tasks found for this user' });
    }

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

const editTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, priority } = req.body;

  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { title, description, priority },  
    });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: 'Error editing task' });
  }
};


const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};


const markTaskAsDone = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { isCompleted: true, completedAt: new Date() },
    });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: 'Error marking task as done' });
  }
};

export default {
  addTask,
  getTasks,
  editTask,
  deleteTask,
  markTaskAsDone,
};
