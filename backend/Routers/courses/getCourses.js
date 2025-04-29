import {Router} from 'express';
import pool from '../../functions/datatabase.js';
const router = Router();

router.get('/', async (req, res) => {
    try{
        const courses = await pool.query('SELECT * FROM courses');
        if (courses.rows.length === 0) {
            return res.status(404).json({ message: 'No courses found' });
        }
        res.status(200).json(courses.rows);
    } catch(err){
        console.error('Error getting courses', err);
        res.status(500).json({
            message: 'Error getting courses',
            details: err.message
        });
    }
});

export default router;