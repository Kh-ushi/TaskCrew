import Task from "../models/Task.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";


const calculateSpaceMterics = async (req, res) => {
    try {
        const spaceId = new mongoose.Types.ObjectId(req.params.spaceId);
        const now = new Date();

        const [doc] = await Project.aggregate([

            { $match: { spaceId } },
            {
                $facet: {
                    totals: [{ $count: "projectsTotal" }],
                    byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
                    overdueProjects: [
                        { $match: { state: { $ne: "completed" }, endDate: { $ne: null, $lt: now } } },
                        { $count: "overdue" }
                    ],
                    teamSize: [
                        { $project: { membersCount: { $size: { $ifNull: ["$members", []] } } } },
                        { $group: { _id: null, avgMembers: { $avg: "$membersCount" }, maxMembers: { $max: "$membersCount" } } }
                    ],
                    recency: [{ $group: { _id: null, lastUpdate: { $max: "$updatedAt" } } }]
                }
            }
            , {
                $project: {
                    projectsTotal: { $ifNull: [{ $arrayElemAt: ["$totals.projectsTotal", 0] }, 0] },
                    byStatus: 1,
                    overdueProjects: { $ifNull: [{ $arrayElemAt: ["$overfueProjects.overdue", 0] }, 0] },
                    avgMembers: { $ifNull: [{ $arrayElemAt: ["$teamSize.avgMembers", 0] }, 0] },
                    maxMembers: { $ifNull: [{ $arrayElemAt: ["$teamSize.maxMembers", 0] }, 0] },
                    lastUpdate: { $ifNull: [{ $arrayElemAt: ["$recency.lastUpdate", 0] }, null] }
                }

            }

        ]);

        const byStatus = Object.fromEntries((doc?.byStatus || []).map(s => [s._id || "unknown", s.count]));

        res.status(200).json({
            projectsTotal: doc?.projectsTotal || 0,
            status: byStatus,
            overdueProjects: doc?.overdueProjects || 0,
            avgMembers: Number((doc?.avgMembers || 0).toFixed(2)),
            maxMembers: doc?.maxMembers || 0,
            lastUpdate: doc?.lastUpdate || null
        });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const calculateSpaceMtericsDeep = async (req, res) => {
    try {
        const spaceId = new mongoose.Types.ObjectId(req.params.spaceId);
        const now = new Date();
        const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [out] = await Project.aggregate([
            { $match: { spaceId } },
            {
                $lookup: {
                    from: "tasks",
                    let: { pid: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$projectId", "$$pid"] } } },
                        { $project: { status: 1, dueAt: 1, createdAt: 1, completedAt: 1 } }
                    ],
                    as: "tasks"
                }
            },
            {
                $facet: {
                    projCounts: [
                        { $group: { _id: "state", $count: { $sum: 1 } } }
                    ],
                    perProject: [
                        {
                            $project: {
                                projectId: "$_id",
                                name: "$name",
                                total: { $size: "$tasks" },
                                done: {
                                    $size: {
                                        $filter: { input: "$tasks", as: "t", cond: { $eq: ["$$t.status", "done"] } }
                                    }
                                },
                                overdue: {
                                    $size: {
                                        $filter: {
                                            input: "$tasks",
                                            as: "t",
                                            cond: { $and: [{ $ne: ["$$t.status", "done"] }, { $lt: ["$$t.dueAt", now] }] }
                                        }
                                    }
                                }
                            }
                        }
                    ],
                    rollup: [
                        {
                            $project: {
                                totalTasks: { $size: "$tasks" },
                                doneTasks: {
                                    $size: {
                                        $filter: { input: "$tasks", as: "t", cond: { $eq: ["$$t.status", "done"] } }
                                    }
                                },
                                overdueTasks: {
                                    $size: {
                                        $filter: {
                                            input: "$tasks",
                                            as: "t",
                                            cond: { $and: [{ $ne: ["$$t.status", "done"] }, { $lt: ["$$t.dueAt", now] }] }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                projectsTotal: { $sum: 1 },
                                tasksTotal: { $sum: "$totalTasks" },
                                tasksDone: { $sum: "$doneTasks" },
                                tasksOverdue: { $sum: "$overdueTasks" }
                            }
                        }
                    ],
                    velocity: [
                        { $unwind: { path: "$tasks", preserveNullAndEmptyArrays: false } },
                        { $match: { "tasks.status": "done", "tasks.completedAt": { $gte: last30 } } },
                        {
                            $group: {
                                _id: { $isoWeek: "$tasks.completedAt" },
                                weekStart: { $min: { $dateTrunc: { date: "$tasks.completedAt", unit: "week" } } },
                                done: { $sum: 1 }
                            }
                        },
                        { $sort: { weekStart: 1 } }
                    ],
                    lead: [
                        { $unwind: { path: "$tasks", preserveNullAndEmptyArrays: false } },
                        { $match: { "tasks.status": "done", "tasks.completedAt": { $ne: null } } },
                        {
                            $project: {
                                d: {
                                    $divide: [{ $subtract: ["$tasks.completedAt", "$tasks.createdAt"] }, 1000 * 60 * 60 * 24]
                                }
                            }
                        },
                        { $group: { _id: null, avgDays: { $avg: "$d" } } }
                    ]
                }
            }
            , {
                $project: {
                    projectsTotal: { $ifNull: [{ $arrayElemAt: ["$rollup.projectsTotal", 0] }, 0] },
                    tasksTotal: { $ifNull: [{ $arrayElemAt: ["$rollup.tasksTotal", 0] }, 0] },
                    tasksDone: { $ifNull: [{ $arrayElemAt: ["$rollup.tasksDone", 0] }, 0] },
                    tasksOverdue: { $ifNull: [{ $arrayElemAt: ["$rollup.tasksOverdue", 0] }, 0] },
                    velocity: 1,
                    projCounts: 1,
                    perProject: 1,
                    leadTimeAvgDays: { $ifNull: [{ $arrayElemAt: ["$lead.avgDays", 0] }, null] }
                }
            }

        ]);
    }
    catch (error) {

    }
};

const calcProjectMetrics = async (req, res) => {
    try {

        // console.log("Project Metrics");
        const projectId = new mongoose.Types.ObjectId(req.params.projectId);

        const now = new Date();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const statusBuckets = await Task.aggregate([
            { $match: { projectId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // console.log(statusBuckets);

        const total = statusBuckets?.reduce((s, x) => s + x.count, 0) || 0;
        const doneCount = statusBuckets?.find(x => x._id === "done")?.count || 0;


        // // This + in front of the parentheses is a unary plus operator.
        // // It converts the string returned by .toFixed(1) back into a number.
        const completionRate = total ? +(doneCount / total * 100).toFixed(1) : 0;

        // console.log(completionRate);

        const [overdueAgg] = await Task.aggregate([
            {
                $match: {
                    projectId,
                    status: { $ne: "done" },
                    $or: [
                        { endDate: { $lt: now } },
                        { endDate: null }
                    ]
                }
            },
            { $count: "overdue" }
        ]);

        // console.log(overdueAgg);


        const overdue = overdueAgg?.overdue || 0;
        const overdueRate = total ? +(overdue / total * 100).toFixed(1) : 0;

        // console.log(overdueRate);


        const velocity = await Task.aggregate([
            { $match: { projectId, status: "done", completedAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $isoWeek: "$completedAt" },
                    weekstart: { $min: { dateTrunc: { date: "$completedAt", unit: "week", binSize: 1 } } },
                    done: { $sum: 1 }
                }
            },
            { $sort: { weekstart: 1 } }
        ]);

        const [lead] = await Task.aggregate([
            { $match: { projectId, status: "done", completedAt: { $ne: null } } },
            { $project: { d: { $divide: [{ $subtract: ["$completedAt", "$createdAt"] }, 1000 * 60 * 60 * 24] } } },
            { $group: { _id: null, avgDays: { $avg: "$d" } } }
        ]);

        // console.log(lead);

        res.status(200).json({
            total, done: doneCount, completionRate,
            overdue, overdueRate,
            velocity,
            leadTimeAvgDays: lead ? +lead.avgDays.toFixed(2) : null
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json(error, "Internal Server error");
    }
};


const overAllProjectMetrics = async (req, res) => {

    try {

        const { spaceId } = req.params;
        const now = new Date();

        const [out] = await Project.aggregate([
            { $match: { spaceId } },
            {
                $lookup: {
                    from: "tasks",
                    let: { pid: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$projectId", "$$pid"] } } },
                        { $project: { status: 1, startDate: 1, endDate: 1, completedAt: 1, createdAt: 1 } }
                    ],
                    as: "tasks"
                }
            },
            {
                $facet: {
                    totalProjects: [{ $count: "projectsTotal" }],
                    projCounts: [{ $group: { _id: "$state", count: { $sum: 1 } } }],
                    taskBuckets: [
                        { $unwind: { path: "$tasks", preserveNullAndEmptyArrays: false } },
                        {
                            $group: {
                                _id: {
                                    $switch: {
                                        branches: [
                                            { case: { $eq: ["$tasks.status", "done"] }, then: "completed" },
                                            { case: { $in: ["$tasks.status", ["in-progress", "review"]] }, then: "inProgress" }
                                        ],
                                        default: "todo"
                                    }
                                },
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    taskTotals: [
                        {
                            $project: {
                                tcount: { $size: { $ifNull: ["$tasks", []] } },
                                overdue: {
                                    $size: {
                                        $filter: {
                                            input: { $ifNull: ["$tasks", []] },
                                            as: "t",
                                            cond: {
                                                $and: [
                                                    { $ne: ["$$t.status", "done"] },
                                                    { $ne: ["$$t.endDate", null] },
                                                    { $lt: ["$$t.endDate", now] }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                tasksTotal: { $sum: "$tcount" },
                                overdueTasks: { $sum: "$overdue" }
                            }
                        }
                    ],

                }
            },
            {
                $project: {
                    projectsTotal: {
                        $ifNull: [{ $arrayElemAt: ["$totalProjects.projectsTotal", 0] }, 0]
                    },
                    projectBuckets: {
                        $arrayToObject: {
                            $map: { input: "$projCounts", as: "p", in: ["$$p._id", "$$p.count"] }
                        }
                    },
                    taskBuckets: {
                        $arrayToObject: {
                            $map: { input: "$taskBuckets", as: "b", in: ["$$b._id", "$$b.count"] }
                        }
                    },
                    totalTasks: { $ifNull: [{ $arrayElemAt: ["$taskTotals.tasksTotal", 0] }, 0] },
                    overdueTasks: { $ifNull: [{ $arrayElemAt: ["$taskTotals.overdueTasks", 0] }, 0] }
                }
            },
            {
                $addFields: {
                    todo: { $ifNull: ["$taskBuckets.todo", 0] },
                    inProgress: { $ifNull: ["$taskBuckets.inProgress", 0] },
                    completed: { $ifNull: ["$taskBuckets.completed", 0] },
                    completionRate: {
                        $cond: [
                            { $gt: ["$totalTasks", 0] },
                            {
                                $round: [
                                    {
                                        $multiply: [
                                            { $divide: ["$taskBuckets.completed", "$totalTasks"] },
                                            100
                                        ]
                                    },
                                    1
                                ]
                            },
                            0
                        ]
                    }
                }
            },


            {
                $project: {
                    projectsTotal: 1,
                    projectBuckets: 1,
                    totalTasks: 1,
                    todo: 1,
                    inProgress: 1,
                    completed: 1,
                    completionRate: 1,
                    overdueTasks: 1
                }
            }
        ]);


        res.json(out || {
            projectsTotal: 0, projectBuckets: {}, totalTasks: 0,
            todo: 0, inProgress: 0, completed: 0, completionRate: 0, overdueTasks: 0
        });

    }

    catch (error) {
        console.log(error);
        res.status(500).json(error, "Internal Server error");
    }
}


const getProjectProgressLast4Weeks = async (req, res) => {
    try {

        const { spaceId } = req.params;
        const now = new Date();
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(now.getDate() - 28);

        const weeklyProgress = await Task.aggregate([
            {
                $lookup: {
                    from: "projects",
                    localField: "projectId",
                    foreignField: "_id",
                    as: "project"
                }
            },
            { $unwind: { path: "$project", preserveNullAndEmptyArrays: false } },

            {
                $match: {
                    "project.spaceId": spaceId,
                    $or: [
                        { completedAt: { $gte: fourWeeksAgo } },
                        {
                            $and: [
                                { endDate: { $gte: fourWeeksAgo, $lte: now } },
                                { status: { $ne: "done" } }
                            ]
                        }
                    ]
                }
            },

            {
                $addFields: {
                    weekStart: {
                        $dateTrunc: {
                            date: { $ifNull: ["$completedAt", { $ifNull: ["$updatedAt", "$endDate"] }] },
                            unit: "week",
                            binSize: 1
                        }
                    }
                }
            },

            {
                $group: {
                    _id: "$weekStart",
                    totalTasks: { $sum: 1 },
                    doneTasks: {
                        $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] }
                    },
                    inProgressTasks: {
                        $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] }
                    },
                    todoTasks: {
                        $sum: { $cond: [{ $eq: ["$status", "to-do"] }, 1, 0] }
                    }
                }
            },

            {
                $addFields: {
                    progress: {
                        $cond: [
                            { $eq: ["$totalTasks", 0] },
                            0,
                            { $multiply: [{ $divide: ["$doneTasks", "$totalTasks"] }, 100] }
                        ]
                    }
                }
            },

            { $sort: { _id: 1 } }
        ]);

        console.log(weeklyProgress);


        const [overall] = await Task.aggregate([
            {
                $lookup: {
                    from: "projects",
                    localField: "projectId",
                    foreignField: "_id",
                    as: "project"
                }
            },
            { $unwind: { path: "$project", preserveNullAndEmptyArrays: false } },
            {
                $match: {
                    "project.spaceId": spaceId,
                    $or: [
                        { completedAt: { $gte: fourWeeksAgo } },
                        {
                            $and: [
                                { endDate: { $gte: fourWeeksAgo, $lte: now } },
                                { status: { $ne: "done" } }
                            ]
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalTasks: { $sum: 1 },
                    doneTasks: {
                        $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    currentProgress: {
                        $cond: [
                            { $eq: ["$totalTasks", 0] },
                            0,
                            { $multiply: [{ $divide: ["$doneTasks", "$totalTasks"] }, 100] }
                        ]
                    }
                }
            }

        ]);

        const currentProgress = overall?.currentProgress || 0;

        let projectedProgress = currentProgress;
        if (weeklyProgress.length >= 2) {
            const lastTwo = weeklyProgress.slice(-2).map(w => w.progress);
            const delta = lastTwo[1] - lastTwo[0];
            projectedProgress = Math.min(100, currentProgress + delta);
        }

        return res.status(200).json({
            success: true,
            data: {
                weeklyProgress,
                currentProgress: +currentProgress.toFixed(1),
                projectedProgress: +projectedProgress.toFixed(1)
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error, "Internal Server error");
    }

};




export { calculateSpaceMterics, calcProjectMetrics, calculateSpaceMtericsDeep, overAllProjectMetrics, getProjectProgressLast4Weeks };
