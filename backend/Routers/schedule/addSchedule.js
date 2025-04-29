import {Router} from 'express';
import pool from "../../functions/datatabase.js";
import Joi from 'joi';
const router = Router();

const scheduleSchema = Joi.object({
    group_id: Joi.number().integer().required(),
    subject: Joi.number().required(),
    teacher: Joi.number().required(),
    day: Joi.string().required(),
    start_time: Joi.string().required(),
    end_time: Joi.string().required(),
    room_number: Joi.string().required()
});

router.post('/', async (req, res) => {
    const { error, value } = scheduleSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: 'Invalid input data',
            details: error.details
        });
    }

    const { group_id, subject, teacher, day, start_time, end_time, room_number } = value;

    try {
        const newSchedule = await pool.query(
            'INSERT INTO schedule (group_id, subject, teacher, day, start_time, end_time, room_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [group_id, subject, teacher, day, start_time, end_time, room_number]
        );

        res.status(201).json(newSchedule.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
});

export default router;