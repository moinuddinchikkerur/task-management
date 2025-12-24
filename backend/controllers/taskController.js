// import Task from '../models/taskModel.js';

// // Create a new task
// export const createTask = async (req, res) => {
//     try{
//         const { title, description, priority, dueDate,compeleted } = req.body;
//         const task = new Task({
//             title,
//             description,
//             priority,
//             dueDate,
//             compeleted: compeleted === 'Yes' || compeleted === true,
//             owner: req.user._id
//         });
//         const saved= await task.save();
//         res.status(201).json({success: true, task: saved });
//     }

//    catch (err) {
//         console.err('Error creating task:', error);
//         res.status(400).json({ success: false, message: 'Error creating task'});
//     }
// }   

// // Get all tasks
// export const getTask= async (req, res) => {
//     try {
//         const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
//         res.status(200).json({ success: true, tasks });
//     } catch (error) {
//         console.error('Error fetching tasks:', error);
//         res.status(500).json({ success: false, message: 'Error fetching tasks' });
//     }
// }

// // Get a single task by ID
// export const getTaskById = async (req, res) => {
//     try {
//         const task = await Task.findOne({_id:req.params.id,owner: req.user._id});
//         if (!task) {
//             return res.status(404).json({ success: false, message: 'Task not found' });
//         }
//         res.status(200).json({ success: true, task });
//     }
//     catch (err) {
//         console.err('Error fetching task:', err);
//         res.status(500).json({ success: false, message: 'Error fetching task' });
//     }
// }

// // Update a task by ID
// export const updateTask = async (req, res) => {
//     try {
//         const data ={...req.body};
//         if (data.compeleted !== undefined) {
//             data.compeleted = data.compeleted === 'Yes' || data.compeleted === true;
//         }
//         const updated= await Task.findOneAndUpdate(
//             { _id: req.params.id, owner: req.user._id },
//             data,
//             { new: true, runValidators: true }
//         );
//         if (!updated) {
//             return res.status(404).json({ success: false, message: 'Task not found' });
//         }
//         res.status(200).json({ success: true, task: updated });
//     }
//     catch (err) {
//         console.error('Error updating task:', err);
//         res.status(400).json({ success: false, message: 'Error updating task' });
//     }
// }

// // Delete a task by ID
// export const deleteTask = async (req, res) => {
//     try {
//         const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
//         if (!deleted) {
//             return res.status(404).json({ success: false, message: 'Task not found' });
//         }
//         res.status(200).json({ success: true, message: 'Task deleted successfully' });
//     } catch (err) {
//         console.err('Error deleting task:', err);
//         res.status(500).json({ success: false, message: 'Error deleting task' });
//     }
// }



import Task from '../models/taskModel.js';


// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed: completed === 'Yes' || completed === true,
      owner: req.user._id
    });
    const saved = await task.save();
    res.status(201).json({ success: true, task: saved });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(400).json({ success: false, message: 'Error creating task' });
  }
};

// Get all tasks
export const getTask = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ success: false, message: 'Error fetching tasks' });
  }
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, task });
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ success: false, message: 'Error fetching task' });
  }
};

// Update a task by ID
export const updateTask = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.completed !== undefined) {
      data.completed = data.completed === 'Yes' || data.completed === true;
    }
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      data,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, task: updated });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(400).json({ success: false, message: 'Error updating task' });
  }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ success: false, message: 'Error deleting task' });
  }
};
