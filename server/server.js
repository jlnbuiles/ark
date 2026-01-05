import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory student data
let students = [
    { id: 1, name: 'Emma Johnson', lessonsRemaining: 10, lessonsCompleted: 15, specialConditions: ['autism', 'anxiety'], notes: 'Prefers quiet environment. Needs extra time for transitions.', dateOfBirth: '2015-03-15', enrollmentDate: '2024-01-10', guardianName: 'Sarah Johnson', guardianEmail: 'sarah.j@email.com', guardianPhone: '(555) 123-4567', guardianAddress: '123 Oak St, Springfield, IL 62701' },
    { id: 2, name: 'Michael Chen', lessonsRemaining: 8, lessonsCompleted: 12, specialConditions: ['adhd'], notes: 'Works best with frequent breaks. Responds well to positive reinforcement.', dateOfBirth: '2016-07-22', enrollmentDate: '2024-02-15', guardianName: 'Wei Chen', guardianEmail: 'wei.chen@email.com', guardianPhone: '(555) 234-5678', guardianAddress: '456 Maple Ave, Springfield, IL 62702' },
    { id: 3, name: 'Sophia Martinez', lessonsRemaining: 12, lessonsCompleted: 8, specialConditions: [], notes: null, dateOfBirth: '2014-11-08', enrollmentDate: '2023-09-01', guardianName: 'Carlos Martinez', guardianEmail: 'carlos.m@email.com', guardianPhone: '(555) 345-6789', guardianAddress: '789 Pine Rd, Springfield, IL 62703' },
    { id: 4, name: 'James Wilson', lessonsRemaining: 5, lessonsCompleted: 20, specialConditions: ['dyslexia'], notes: 'Benefits from visual aids and hands-on learning.', dateOfBirth: '2015-05-30', enrollmentDate: '2023-10-12', guardianName: 'Jennifer Wilson', guardianEmail: 'jen.wilson@email.com', guardianPhone: '(555) 456-7890', guardianAddress: '321 Elm St, Springfield, IL 62704' },
    { id: 5, name: 'Olivia Brown', lessonsRemaining: 15, lessonsCompleted: 5, specialConditions: ['allergies'], notes: 'Severe peanut allergy - EpiPen in office.', dateOfBirth: '2016-01-18', enrollmentDate: '2024-03-20', guardianName: 'Michael Brown', guardianEmail: 'm.brown@email.com', guardianPhone: '(555) 567-8901', guardianAddress: '654 Birch Ln, Springfield, IL 62705' },
    { id: 6, name: 'Liam Davis', lessonsRemaining: 3, lessonsCompleted: 18, specialConditions: ['hearing_impaired'], notes: 'Uses hearing aids. Speak clearly and face student when talking.', dateOfBirth: '2015-09-12', enrollmentDate: '2023-08-15', guardianName: 'Amanda Davis', guardianEmail: 'amanda.d@email.com', guardianPhone: '(555) 678-9012', guardianAddress: '987 Cedar Dr, Springfield, IL 62706' },
    { id: 7, name: 'Ava Garcia', lessonsRemaining: 7, lessonsCompleted: 10, specialConditions: ['vision_impaired'], notes: null, dateOfBirth: '2015-06-20', enrollmentDate: '2024-01-05', guardianName: 'Maria Garcia', guardianEmail: 'maria.g@email.com', guardianPhone: '(555) 789-0123', guardianAddress: '147 Willow Way, Springfield, IL 62707' },
    { id: 8, name: 'Noah Rodriguez', lessonsRemaining: 14, lessonsCompleted: 6, specialConditions: ['mobility_issues'], notes: 'Wheelchair accessible areas required.', dateOfBirth: '2016-04-10', enrollmentDate: '2024-02-28', guardianName: 'Luis Rodriguez', guardianEmail: 'luis.r@email.com', guardianPhone: '(555) 890-1234', guardianAddress: '258 Spruce St, Springfield, IL 62708' },
    { id: 9, name: 'Isabella Lee', lessonsRemaining: 9, specialConditions: ['autism', 'adhd'] },
    { id: 10, name: 'Ethan Anderson', lessonsRemaining: 11, specialConditions: [] },
    { id: 11, name: 'Mia Taylor', lessonsRemaining: 6, specialConditions: ['anxiety', 'allergies'] },
    { id: 12, name: 'Lucas Thomas', lessonsRemaining: 13, specialConditions: ['dyslexia', 'adhd'] },
    { id: 13, name: 'Charlotte Moore', lessonsRemaining: 4, specialConditions: ['autism'] },
    { id: 14, name: 'Oliver Jackson', lessonsRemaining: 16, specialConditions: [] },
    { id: 15, name: 'Amelia White', lessonsRemaining: 8, specialConditions: ['hearing_impaired', 'anxiety'] },
    { id: 16, name: 'Elijah Harris', lessonsRemaining: 10, specialConditions: ['other'] },
    { id: 17, name: 'Harper Clark', lessonsRemaining: 12, specialConditions: ['allergies'] },
    { id: 18, name: 'Benjamin Lewis', lessonsRemaining: 5, specialConditions: ['adhd', 'dyslexia'] },
    { id: 19, name: 'Evelyn Walker', lessonsRemaining: 9, specialConditions: [] },
    { id: 20, name: 'Mason Hall', lessonsRemaining: 7, specialConditions: ['vision_impaired', 'allergies'] },
    { id: 21, name: 'Abigail Allen', lessonsRemaining: 11, specialConditions: ['autism', 'anxiety', 'adhd'] },
    { id: 22, name: 'Logan Young', lessonsRemaining: 14, specialConditions: [] },
    { id: 23, name: 'Emily King', lessonsRemaining: 6, specialConditions: ['dyslexia'] },
    { id: 24, name: 'Alexander Wright', lessonsRemaining: 8, specialConditions: ['mobility_issues', 'allergies'] },
    { id: 25, name: 'Ella Scott', lessonsRemaining: 13, specialConditions: [] },
    { id: 26, name: 'William Green', lessonsRemaining: 10, specialConditions: ['hearing_impaired'] },
    { id: 27, name: 'Avery Adams', lessonsRemaining: 15, specialConditions: ['anxiety'] },
    { id: 28, name: 'Daniel Baker', lessonsRemaining: 4, specialConditions: ['autism', 'dyslexia'] },
    { id: 29, name: 'Sofia Nelson', lessonsRemaining: 9, specialConditions: [] },
    { id: 30, name: 'Matthew Carter', lessonsRemaining: 12, specialConditions: ['adhd', 'allergies'] },
    { id: 31, name: 'Scarlett Mitchell', lessonsRemaining: 7, specialConditions: ['other'] },
    { id: 32, name: 'Jackson Perez', lessonsRemaining: 11, specialConditions: [] },
    { id: 33, name: 'Victoria Roberts', lessonsRemaining: 5, specialConditions: ['vision_impaired'] },
    { id: 34, name: 'Sebastian Turner', lessonsRemaining: 14, specialConditions: ['autism', 'adhd', 'anxiety'] },
    { id: 35, name: 'Grace Phillips', lessonsRemaining: 8, specialConditions: [] },
    { id: 36, name: 'Jack Campbell', lessonsRemaining: 10, specialConditions: ['dyslexia', 'adhd'] },
    { id: 37, name: 'Chloe Parker', lessonsRemaining: 6, specialConditions: ['allergies', 'anxiety'] },
    { id: 38, name: 'Owen Evans', lessonsRemaining: 13, specialConditions: [] },
    { id: 39, name: 'Lily Edwards', lessonsRemaining: 9, specialConditions: ['hearing_impaired', 'other'] },
    { id: 40, name: 'Aiden Collins', lessonsRemaining: 12, specialConditions: ['mobility_issues'] },
    { id: 41, name: 'Zoey Stewart', lessonsRemaining: 15, specialConditions: [] },
    { id: 42, name: 'Carter Sanchez', lessonsRemaining: 7, specialConditions: ['autism'] },
    { id: 43, name: 'Penelope Morris', lessonsRemaining: 11, specialConditions: ['adhd', 'dyslexia', 'anxiety'] },
    { id: 44, name: 'Wyatt Rogers', lessonsRemaining: 4, specialConditions: [] },
    { id: 45, name: 'Layla Reed', lessonsRemaining: 8, specialConditions: ['vision_impaired', 'allergies'] },
    { id: 46, name: 'Grayson Cook', lessonsRemaining: 14, specialConditions: ['other'] },
    { id: 47, name: 'Aria Morgan', lessonsRemaining: 10, specialConditions: [] },
    { id: 48, name: 'Luke Bell', lessonsRemaining: 6, specialConditions: ['autism', 'anxiety'] },
    { id: 49, name: 'Nora Murphy', lessonsRemaining: 13, specialConditions: ['hearing_impaired'] },
    { id: 50, name: 'Henry Bailey', lessonsRemaining: 9, specialConditions: ['dyslexia', 'adhd'] }
];

// In-memory horse data
let horses = [
    { id: 1, name: 'Lucero', ridingStyle: 'English', difficultyLevel: 'Beginner', condition: 'Great' },
    { id: 2, name: 'Relámpago', ridingStyle: 'Western', difficultyLevel: 'Advanced', condition: 'Great' },
    { id: 3, name: 'Canela', ridingStyle: 'Trail', difficultyLevel: 'Beginner', condition: 'Good' },
    { id: 4, name: 'Luna', ridingStyle: 'English', difficultyLevel: 'Intermediate', condition: 'Great' },
    { id: 5, name: 'Dorado', ridingStyle: 'Western', difficultyLevel: 'Beginner', condition: 'Great' },
    { id: 6, name: 'Mariposa', ridingStyle: 'Dressage', difficultyLevel: 'Intermediate', condition: 'Good' },
    { id: 7, name: 'Trueno', ridingStyle: 'Jumping', difficultyLevel: 'Advanced', condition: 'Great' },
    { id: 8, name: 'Esperanza', ridingStyle: 'Trail', difficultyLevel: 'Beginner', condition: 'Good' },
    { id: 9, name: 'Cielo', ridingStyle: 'Dressage', difficultyLevel: 'Intermediate', condition: 'Good' }
];

// In-memory teacher data
let teachers = [
    { id: 1, firstName: 'Sofia', lastName: 'Martínez', specialty: 'English Riding', experience: 12, certification: 'Level 3 Instructor', address: '123 Riding Lane, Springfield, IL 62701', phone: '(555) 901-2345' },
    { id: 2, firstName: 'Carlos', lastName: 'Rodríguez', specialty: 'Western Riding', experience: 15, certification: 'Master Instructor', address: '456 Ranch Road, Springfield, IL 62702', phone: '(555) 902-3456' },
    { id: 3, firstName: 'María', lastName: 'González', specialty: 'Therapeutic Riding', experience: 8, certification: 'PATH Certified', address: '789 Therapy Trail, Springfield, IL 62703', phone: '(555) 903-4567' },
    { id: 4, firstName: 'Diego', lastName: 'Hernández', specialty: 'Dressage', experience: 20, certification: 'Level 4 Instructor', address: '321 Dressage Drive, Springfield, IL 62704', phone: '(555) 904-5678' },
    { id: 5, firstName: 'Andrea', lastName: 'López', specialty: 'Jumping', experience: 10, certification: 'Level 3 Instructor', address: '654 Jump Street, Springfield, IL 62705', phone: '(555) 905-6789' },
    { id: 6, firstName: 'Juan', lastName: 'Torres', specialty: 'Trail Riding', experience: 7, certification: 'Level 2 Instructor', address: '987 Trail Court, Springfield, IL 62706', phone: '(555) 906-7890' },
    { id: 7, firstName: 'Isabella', lastName: 'Ramírez', specialty: 'Beginner Lessons', experience: 5, certification: 'Level 2 Instructor', address: '147 Beginner Boulevard, Springfield, IL 62707', phone: '(555) 907-8901' }
];

// Get all students with search and pagination
app.get('/api/students', (req, res) => {
    const { search = '', page = 1, limit = 10 } = req.query;
    
    // Filter students by search term
    let filteredStudents = students;
    if (search) {
        const searchLower = search.toLowerCase();
        filteredStudents = students.filter(student => 
            student.name.toLowerCase().includes(searchLower)
        );
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
    
    // Add scheduled lesson count to each student
    const studentsWithScheduledCount = paginatedStudents.map(student => {
        let scheduledCount = 0;
        for (const date in scheduledLessons) {
            const lessonsOnDate = scheduledLessons[date].filter(
                lesson => lesson.studentId === student.id && lesson.status === 'scheduled'
            );
            scheduledCount += lessonsOnDate.length;
        }
        return {
            ...student,
            scheduledLessons: scheduledCount,
            unscheduledLessons: student.lessonsRemaining - scheduledCount
        };
    });
    
    res.json({
        students: studentsWithScheduledCount,
        total: filteredStudents.length,
        page: pageNum,
        totalPages: Math.ceil(filteredStudents.length / limitNum)
    });
});

// Add a new student
app.post('/api/students', (req, res) => {
    const { name, lessonsRemaining } = req.body;
    
    if (!name || lessonsRemaining === undefined) {
        return res.status(400).json({ error: 'Name and lessons are required' });
    }
    
    const newStudent = {
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        name,
        lessonsRemaining: parseInt(lessonsRemaining)
    };
    
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// Get a single student by ID
app.get('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
});

// Check in a student (decrease lessons by 1)
app.post('/api/students/:id/checkin', (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    if (student.lessonsRemaining > 0) {
        student.lessonsRemaining--;
        res.json(student);
    } else {
        res.status(400).json({ error: 'No lessons remaining' });
    }
});

// Update student lessons
app.put('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    if (req.body.lessonsRemaining !== undefined) {
        student.lessonsRemaining = req.body.lessonsRemaining;
    }
    
    res.json(student);
});

// Get count of scheduled (non-completed, non-cancelled) lessons for a student
app.get('/api/students/:id/scheduled-count', (req, res) => {
    const studentId = parseInt(req.params.id);
    
    let count = 0;
    // Count all scheduled lessons for this student across all dates
    for (const date in scheduledLessons) {
        const lessonsOnDate = scheduledLessons[date].filter(
            lesson => lesson.studentId === studentId && lesson.status === 'scheduled'
        );
        count += lessonsOnDate.length;
    }
    
    res.json({ count });
});

// In-memory schedule data (indexed by date)
let scheduledLessons = {};

// Initialize with sample data
const initializeSchedule = (date) => {
    if (!scheduledLessons[date]) {
        scheduledLessons[date] = [];
    }
};

// Get schedule for a specific date
app.get('/api/schedule', (req, res) => {
    const { date } = req.query;
    initializeSchedule(date);
    
    // Generate sample schedule data for the requested date if empty
    // In a real app, this would come from a database
    if (scheduledLessons[date].length === 0) {
        scheduledLessons[date] = [
        {
            time: '9:00 AM',
            studentId: students[0]?.id || 1,
            studentName: students[0]?.name || 'Emma Johnson',
            lessonsRemaining: students[0]?.lessonsRemaining || 8,
            specialConditions: ['autism', 'anxiety'],
            status: 'scheduled',
            horseId: horses[0]?.id || 1,
            horseName: horses[0]?.name || 'Lucero',
            instructorId: teachers[0]?.id || 1,
            instructorName: `${teachers[0]?.firstName || 'Sofia'} ${teachers[0]?.lastName || 'Martínez'}`
        },
        {
            time: '10:30 AM',
            studentId: students[2]?.id || 3,
            studentName: students[2]?.name || 'Sophia Martinez',
            lessonsRemaining: students[2]?.lessonsRemaining || 2,
            specialConditions: ['adhd'],
            status: 'scheduled',
            horseId: horses[2]?.id || 3,
            horseName: horses[2]?.name || 'Canela',
            instructorId: teachers[6]?.id || 7,
            instructorName: `${teachers[6]?.firstName || 'Isabella'} ${teachers[6]?.lastName || 'Ramírez'}`
        },
        {
            time: '1:00 PM',
            studentId: students[4]?.id || 5,
            studentName: students[4]?.name || 'Olivia Brown',
            lessonsRemaining: students[4]?.lessonsRemaining || 5,
            specialConditions: [],
            status: 'completed',
            horseId: horses[1]?.id || 2,
            horseName: horses[1]?.name || 'Relámpago',
            instructorId: teachers[1]?.id || 2,
            instructorName: `${teachers[1]?.firstName || 'Carlos'} ${teachers[1]?.lastName || 'Rodríguez'}`
        },
        {
            time: '2:30 PM',
            studentId: students[6]?.id || 7,
            studentName: students[6]?.name || 'Ava Garcia',
            lessonsRemaining: students[6]?.lessonsRemaining || 1,
            specialConditions: ['hearing_impaired', 'allergies'],
            status: 'scheduled',
            horseId: horses[0]?.id || 1,
            horseName: horses[0]?.name || 'Lucero',
            instructorId: teachers[2]?.id || 3,
            instructorName: `${teachers[2]?.firstName || 'María'} ${teachers[2]?.lastName || 'González'}`
        },
        {
            time: '4:00 PM',
            studentId: students[8]?.id || 9,
            studentName: students[8]?.name || 'Isabella Lee',
            lessonsRemaining: students[8]?.lessonsRemaining || 10,
            specialConditions: ['dyslexia'],
            status: 'scheduled',
            horseId: horses[3]?.id || 4,
            horseName: horses[3]?.name || 'Luna',
            instructorId: teachers[0]?.id || 1,
            instructorName: `${teachers[0]?.firstName || 'Sofia'} ${teachers[0]?.lastName || 'Martínez'}`
        },
        {
            time: '5:30 PM',
            studentId: students[10]?.id || 11,
            studentName: students[10]?.name || 'Mia Taylor',
            lessonsRemaining: students[10]?.lessonsRemaining || 6,
            specialConditions: ['anxiety', 'allergies'],
            status: 'scheduled',
            horseId: horses[2]?.id || 3,
            horseName: horses[2]?.name || 'Canela',
            instructorId: teachers[5]?.id || 6,
            instructorName: `${teachers[5]?.firstName || 'Juan'} ${teachers[5]?.lastName || 'Torres'}`
        },
        {
            time: '6:00 PM',
            studentId: students[12]?.id || 13,
            studentName: students[12]?.name || 'Charlotte Moore',
            lessonsRemaining: students[12]?.lessonsRemaining || 4,
            specialConditions: ['autism'],
            status: 'scheduled',
            horseId: horses[0]?.id || 1,
            horseName: horses[0]?.name || 'Lucero',
            instructorId: teachers[3]?.id || 4,
            instructorName: `${teachers[3]?.firstName || 'Diego'} ${teachers[3]?.lastName || 'Hernández'}`
        }];
    }
    
    res.json(scheduledLessons[date]);
});

// Check availability for a lesson (without creating it)
app.post('/api/lessons/check-availability', (req, res) => {
    const { date, time, horseId, instructorId } = req.body;
    
    if (!date || !time || !horseId || !instructorId) {
        return res.status(400).json({ error: 'Date, time, horseId, and instructorId are required' });
    }
    
    initializeSchedule(date);
    
    // Helper function to check if two time slots overlap (assuming 1 hour duration)
    const timesOverlap = (time1, time2) => {
        const parseTime = (timeStr) => {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return hours * 60 + (minutes || 0);
        };
        
        const start1 = parseTime(time1);
        const end1 = start1 + 60;
        const start2 = parseTime(time2);
        const end2 = start2 + 60;
        
        return (start1 < end2 && start2 < end1);
    };
    
    // Check if the horse is already scheduled at this time
    const horseConflict = scheduledLessons[date].find(l => 
        l.horseId === horseId && timesOverlap(l.time, time)
    );
    if (horseConflict) {
        const horse = horses.find(h => h.id === horseId);
        return res.status(409).json({ 
            error: `Horse "${horse?.name}" is already scheduled at ${horseConflict.time}` 
        });
    }
    
    // Check if the instructor is already scheduled at this time
    const instructorConflict = scheduledLessons[date].find(l => 
        l.instructorId === instructorId && timesOverlap(l.time, time)
    );
    if (instructorConflict) {
        const instructor = teachers.find(t => t.id === instructorId);
        return res.status(409).json({ 
            error: `Instructor "${instructor?.firstName} ${instructor?.lastName}" is already scheduled at ${instructorConflict.time}` 
        });
    }
    
    // No conflicts - available
    res.json({ available: true });
});

// Create a new lesson
app.post('/api/lessons', (req, res) => {
    const { date, time, studentId, studentName, horseId, horseName, instructorId, instructorName, lessonsRemaining, specialConditions } = req.body;
    
    if (!date || !time || !studentId || !horseId || !instructorId) {
        return res.status(400).json({ error: 'Date, time, studentId, horseId, and instructorId are required' });
    }
    
    initializeSchedule(date);
    
    // Helper function to check if two time slots overlap (assuming 1 hour duration)
    const timesOverlap = (time1, time2) => {
        // Convert times to minutes for comparison
        const parseTime = (timeStr) => {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return hours * 60 + (minutes || 0);
        };
        
        const start1 = parseTime(time1);
        const end1 = start1 + 60; // 1 hour duration
        const start2 = parseTime(time2);
        const end2 = start2 + 60; // 1 hour duration
        
        // Check if time slots overlap
        return (start1 < end2 && start2 < end1);
    };
    
    // Check if the horse is already scheduled at this time
    const horseConflict = scheduledLessons[date].find(l => 
        l.horseId === horseId && timesOverlap(l.time, time)
    );
    if (horseConflict) {
        return res.status(400).json({ 
            error: `Horse "${horseName}" is already scheduled at ${horseConflict.time}. Horses can only be assigned to one lesson per hour.` 
        });
    }
    
    // Check if the instructor is already scheduled at this time
    const instructorConflict = scheduledLessons[date].find(l => 
        l.instructorId === instructorId && timesOverlap(l.time, time)
    );
    if (instructorConflict) {
        return res.status(400).json({ 
            error: `Instructor "${instructorName}" is already scheduled at ${instructorConflict.time}. Instructors can only teach one lesson per hour.` 
        });
    }
    
    // Create the new lesson
    const newLesson = {
        time,
        studentId,
        studentName,
        lessonsRemaining,
        specialConditions: specialConditions || [],
        status: 'scheduled',
        horseId,
        horseName,
        instructorId,
        instructorName
    };
    
    scheduledLessons[date].push(newLesson);
    
    // Sort lessons by time
    scheduledLessons[date].sort((a, b) => {
        const timeA = a.time.toLowerCase();
        const timeB = b.time.toLowerCase();
        return timeA.localeCompare(timeB);
    });
    
    res.status(201).json(newLesson);
});

// Check into a lesson
app.post('/api/lessons/checkin', (req, res) => {
    const { date, time, studentId } = req.body;
    
    if (!date || !time || !studentId) {
        return res.status(400).json({ error: 'Date, time, and studentId are required' });
    }
    
    initializeSchedule(date);
    
    // Find the lesson
    const lesson = scheduledLessons[date].find(
        l => l.time === time && l.studentId === studentId
    );
    
    if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
    }
    
    if (lesson.status === 'completed') {
        return res.status(400).json({ error: 'Lesson already checked in' });
    }
    
    // Find the student and deduct a lesson
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    if (student.lessonsRemaining <= 0) {
        return res.status(400).json({ error: 'No lessons remaining' });
    }
    
    // Update lesson status and student credits
    lesson.status = 'completed';
    student.lessonsRemaining--;
    lesson.lessonsRemaining = student.lessonsRemaining;
    
    if (student.lessonsCompleted !== undefined) {
        student.lessonsCompleted++;
    } else {
        student.lessonsCompleted = 1;
    }
    
    res.json({ lesson, student });
});

// Undo a lesson check-in
app.post('/api/lessons/undo-checkin', (req, res) => {
    const { date, time, studentId } = req.body;
    
    if (!date || !time || !studentId) {
        return res.status(400).json({ error: 'Date, time, and studentId are required' });
    }
    
    initializeSchedule(date);
    
    // Find the lesson
    const lesson = scheduledLessons[date].find(
        l => l.time === time && l.studentId === studentId
    );
    
    if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
    }
    
    if (lesson.status !== 'completed') {
        return res.status(400).json({ error: 'Lesson is not checked in' });
    }
    
    // Find the student and restore a lesson
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    // Restore lesson status and student credits
    lesson.status = 'scheduled';
    student.lessonsRemaining++;
    lesson.lessonsRemaining = student.lessonsRemaining;
    
    if (student.lessonsCompleted !== undefined && student.lessonsCompleted > 0) {
        student.lessonsCompleted--;
    }
    
    res.json({ lesson, student });
});

// Get all horses
app.get('/api/horses', (req, res) => {
    res.json(horses);
});

// Get lesson counts per horse for a specific date
app.get('/api/horses/lesson-counts', (req, res) => {
    const { date } = req.query;
    
    // In a real app, this would query the database for the specific date
    // For now, using sample schedule data
    const sampleSchedule = [
        { horseId: 1, horseName: 'Lucero' },
        { horseId: 3, horseName: 'Canela' },
        { horseId: 2, horseName: 'Relámpago' },
        { horseId: 1, horseName: 'Lucero' },
        { horseId: 4, horseName: 'Luna' },
        { horseId: 3, horseName: 'Canela' },
        { horseId: 1, horseName: 'Lucero' }
    ];
    
    // Count lessons per horse
    const lessonCounts = {};
    sampleSchedule.forEach(lesson => {
        if (!lessonCounts[lesson.horseId]) {
            lessonCounts[lesson.horseId] = {
                horseId: lesson.horseId,
                horseName: lesson.horseName,
                count: 0
            };
        }
        lessonCounts[lesson.horseId].count++;
    });
    
    res.json(Object.values(lessonCounts));
});

// Add a new horse
app.post('/api/horses', (req, res) => {
    const { name, ridingStyle, difficultyLevel, condition } = req.body;
    
    if (!name || !ridingStyle || !difficultyLevel || !condition) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const newHorse = {
        id: horses.length > 0 ? Math.max(...horses.map(h => h.id)) + 1 : 1,
        name,
        ridingStyle,
        difficultyLevel,
        condition
    };
    
    horses.push(newHorse);
    res.status(201).json(newHorse);
});

// Update a horse
app.put('/api/horses/:id', (req, res) => {
    const horseId = parseInt(req.params.id);
    const horse = horses.find(h => h.id === horseId);
    
    if (!horse) {
        return res.status(404).json({ error: 'Horse not found' });
    }
    
    if (req.body.name !== undefined) horse.name = req.body.name;
    if (req.body.ridingStyle !== undefined) horse.ridingStyle = req.body.ridingStyle;
    if (req.body.difficultyLevel !== undefined) horse.difficultyLevel = req.body.difficultyLevel;
    if (req.body.condition !== undefined) horse.condition = req.body.condition;
    
    res.json(horse);
});

// Delete a horse
app.delete('/api/horses/:id', (req, res) => {
    const horseId = parseInt(req.params.id);
    const horseIndex = horses.findIndex(h => h.id === horseId);
    
    if (horseIndex === -1) {
        return res.status(404).json({ error: 'Horse not found' });
    }
    
    horses.splice(horseIndex, 1);
    res.status(204).send();
});

// Get all teachers
app.get('/api/teachers', (req, res) => {
    res.json(teachers);
});

// Get a specific teacher by ID
app.get('/api/teachers/:id', (req, res) => {
    const teacherId = parseInt(req.params.id);
    const teacher = teachers.find(t => t.id === teacherId);
    
    if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
    }
    
    res.json(teacher);
});

// Create a new teacher
app.post('/api/teachers', (req, res) => {
    const { firstName, lastName, specialty, experience, certification, address, phone } = req.body;
    
    if (!firstName || !lastName || !specialty || experience === undefined) {
        return res.status(400).json({ error: 'First name, last name, specialty, and experience are required' });
    }
    
    const newTeacher = {
        id: teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1,
        firstName,
        lastName,
        specialty,
        experience: parseInt(experience),
        certification: certification || '',
        address: address || '',
        phone: phone || ''
    };
    
    teachers.push(newTeacher);
    res.status(201).json(newTeacher);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
