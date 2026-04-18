import Task from "../models/Task.js";


export const createTask = async (req, res) => {
    const { title, description, completed } = req.body;

    try {
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const task = await Task.create({
            title,
            description,
            completed: completed || false,
            owner: req.user._id,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Make sure the logged in user matches the task owner
        if (task.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "User not authorized" });
        }

        await task.deleteOne();

        res.status(200).json({ message: "Task removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
