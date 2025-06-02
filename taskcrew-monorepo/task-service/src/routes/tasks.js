const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const Task = require('../models/Task');


router.post('/:id', async (req, res) => {
    try {

        const { id } = req.params;


        const { title, description = '', assignee, dueDate } = req.body;


        if (typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ message: 'Project name is required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(id) || (assignee && !mongoose.Types.ObjectId.isValid(assignee))) {
            return res.status(400).json({ message: 'memberIds must be an array of valid user IDs.' });
        }

        const newTask = await Task.create(
            {
                title: title.trim(),
                description: description.trim(),
                projectId: id,
                assignedTo: assignee ? assignee : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                createdBy: req.user.id,
            }
        )

        res.status(201).json({ message: 'Task created successfully', newTask });

    } catch (error) {
        console.log(Error);
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;