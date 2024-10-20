import React, { useEffect, useState, useContext } from 'react';
import { Table, TextInput, Button, Checkbox, Modal, Label } from 'flowbite-react';
import apiRequest from "../lib/apiRequest";
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TaskTable = () => {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const { currentUser } = useContext(AuthContext);
    
    const [modalOpen, setModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'low',
    });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            if (currentUser) {
                try {
                    const response = await apiRequest.get(`/tasks/${currentUser.id}?search=${searchTerm}&completed=${filter !== 'all' ? filter === 'completed' : undefined}`);
                    if (response.data && response.data.tasks) {
                        setTasks(response.data.tasks);
                    } else {
                        setTasks([]);
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to fetch tasks");
                }
            }
        };
        fetchTasks();
    }, [currentUser, searchTerm, filter]);

    const handleDelete = async (taskId) => {
        try {
            await apiRequest.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
            toast.success("Task deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete task");
        }
    };

    const handleMarkAsDone = async (taskId) => {
        try {
            const response = await apiRequest.patch(`/tasks/${taskId}/done`);
            const updatedTask = response.data.task;
            setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));
            toast.success("Task marked as done");
        } catch (error) {
            console.error(error);
            toast.error("Failed to mark task as done");
        }
    };

    const handleAddTask = async () => {
        try {
            const response = await apiRequest.post(`/task`, { ...newTask, userId: currentUser.id });
            setTasks([...tasks, response.data.task]);
            toast.success("Task added successfully");
            setModalOpen(false);
            setNewTask({ title: '', description: '', priority: 'low' });
        } catch (error) {
            console.error(error);
            toast.error("Failed to add task");
        }
    };

    const handleEditTask = async () => {
        try {
            const response = await apiRequest.put(`/tasks/${editingTask.id}`, editingTask);
            const updatedTask = response.data.task;
            setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
            toast.success("Task updated successfully");
            setEditModalOpen(false);
            setEditingTask(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task");
        }
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setEditModalOpen(true);
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between">
                <TextInput
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select onChange={(e) => setFilter(e.target.value)} className="ml-2">
                    <option value="all">All Tasks</option>
                    <option value="completed">Completed</option>
                    <option value="not_completed">Not Completed</option>
                    <option value="priority">Priority</option>
                </select>
                <Button onClick={() => setModalOpen(true)} color="success">Add Task</Button>
            </div>
            <Table>
                <Table.Head>
                    <Table.HeadCell>Title</Table.HeadCell>
                    <Table.HeadCell>Description</Table.HeadCell>
                    <Table.HeadCell>Priority</Table.HeadCell>
                    <Table.HeadCell>Done</Table.HeadCell>
                    <Table.HeadCell>Completion Info</Table.HeadCell> {/* Updated header */}
                    <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <Table.Row key={task.id} className="hover:bg-gray-100">
                                <Table.Cell>{task.title}</Table.Cell>
                                <Table.Cell>{task.description}</Table.Cell>
                                <Table.Cell>{task.priority}</Table.Cell>
                                <Table.Cell>
                                    <Checkbox
                                        checked={task.isCompleted}
                                        onChange={() => handleMarkAsDone(task.id)}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex flex-col"> {/* Completion time displayed vertically */}
                                        <span>{task.isCompleted ? 'Completed' : 'Not completed'}</span>
                                        <span>{task.completedAt ? new Date(task.completedAt).toLocaleString() : 'N/A'}</span>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex flex-col space-y-2"> {/* Delete and Edit buttons separated */}
                                        <Button onClick={() => openEditModal(task)} color="gray">
                                            Edit
                                        </Button>
                                        <Button onClick={() => handleDelete(task.id)} color="failure">
                                            Delete
                                        </Button>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan="6" className="text-center">No tasks found</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

            {/* Add Task Modal */}
            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                <Modal.Header>Add New Task</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="task-title">Title</Label>
                            <TextInput
                                id="task-title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="task-description">Description</Label>
                            <TextInput
                                id="task-description"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="task-priority">Priority</Label>
                            <select
                                id="task-priority"
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleAddTask}>Add Task</Button>
                    <Button color="gray" onClick={() => setModalOpen(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Task Modal */}
            <Modal show={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <Modal.Header>Edit Task</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="edit-task-title">Title</Label>
                            <TextInput
                                id="edit-task-title"
                                value={editingTask?.title || ''}
                                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-task-description">Description</Label>
                            <TextInput
                                id="edit-task-description"
                                value={editingTask?.description || ''}
                                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-task-priority">Priority</Label>
                            <select
                                id="edit-task-priority"
                                value={editingTask?.priority || 'low'}
                                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleEditTask}>Update Task</Button>
                    <Button color="gray" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TaskTable;
