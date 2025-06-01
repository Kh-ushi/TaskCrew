const express = require('express');
const Project = require('../models/Project');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const { computeAllPriorirties } = require("../utils/priorityUtils")


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);



router.post('/', async (req, res) => {
  try {
    console.log(req.body);

    const { name, description = '', memberIds = [], dueDate } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required.' });
    }


    if (!Array.isArray(memberIds) ||
      memberIds.some((m) => !isValidObjectId(m))) {
      return res
        .status(400)
        .json({ message: 'memberIds must be an array of valid user IDs.' });
    }


    const project = await Project.create({
      name: name.trim(),
      description: description.trim(),
      ownerId: req.user.id,
      memberIds,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    if (!project) {
      return res.status(500).json({ message: 'Failed to create project.' });
    }

    console.log('Project created:', project);

    const allProjects = await Project.find({}, '_id name description dueDate priority createdAt');
    const priorityMapping = computeAllPriorirties(allProjects);
    console.log('Computed priority mapping:', priorityMapping);

    const bulkOps = allProjects.map((p) => {
      const pid = p._id;
      const newPriority = priorityMapping[pid.toString()] || 'medium';

      return {
        updateOne: {
          filter: { _id: pid },
          update: { priority: newPriority }
        }
      };

    });

    if (bulkOps.length > 0) {
      await Project.bulkWrite(bulkOps);
    }
    res.status(201).json({ message: 'Project created successfully.' });

  } catch (err) {
    console.log(err);
    console.error('Error [POST /api/projects]:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



router.get('/', async (req, res) => {
  try {

    console.log('Fetching projects for user:', req.user.id);
    const projects = await Project.aggregate([
      {
        $match: {
          $or: [
            { ownerId: new mongoose.Types.ObjectId(req.user.id) },
            { memberIds: new mongoose.Types.ObjectId(req.user.id) }
          ]
        }
      },

      {
        $addFields: {
          priorityOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$priority", "high"] }, then: 1 },
                { case: { $eq: ["$priority", "medium"] }, then: 2 },
                { case: { $eq: ["$priority", "low"] }, then: 3 }
              ]
            }
          }
        }
      },
      {
        $sort: {
          timeline: 1,
          priorityOrder: 1,
        }
      },

      {
        $project: { priorityOrder: 0 }
      },

      {
        $lookup: {
          from: 'users',
          localField: 'memberIds',
          foreignField: '_id',
          as: 'members'
        }
      },

      {
        $project: {
          memberIds: 0
        }
      }

    ]);

    res.status(201).json(projects);
  } catch (err) {
    console.error('Error [GET /api/projects]:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid project ID.' });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can update this project.' });
    }

    const { name, description, memberIds, dueDate } = req.body;
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ message: 'Name must be a non-empty string.' });
      }
      project.name = name.trim();
    }
    if (description !== undefined) {
      project.description = description.trim();
    }
    if (memberIds !== undefined) {
      if (!Array.isArray(memberIds) ||
        memberIds.some((m) => !isValidObjectId(m))) {
        return res
          .status(400)
          .json({ message: 'memberIds must be an array of valid user IDs.' });
      }
      project.memberIds = memberIds;
    }
    if (dueDate !== undefined) {
      project.dueDate = dueDate ? new Date(dueDate) : null;
    }

    await project.save();


    //UPDATING PRIORITY
    const allProjects = await Project.find({}, '_id name description dueDate priority createdAt');
    const priorityMapping = computeAllPriorirties(allProjects);
    console.log('Computed priority mapping:', priorityMapping);

    const bulkOps = allProjects.map((p) => {
      const pid = p._id;
      const newPriority = priorityMapping[pid.toString()] || 'medium';

      return {
        updateOne: {
          filter: { _id: pid },
          update: { priority: newPriority }
        }
      };

    });

    if (bulkOps.length > 0) {
      await Project.bulkWrite(bulkOps);
    }

    res.status(201).json({ message: 'Project Updated successfully.' });
  } catch (err) {
    console.error('Error [PUT /api/projects/:id]:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid project ID.' });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can delete this project.' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Error [DELETE /api/projects/:id]:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


module.exports = router;