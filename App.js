const { useState } = React;

function App() {
    const [students, setStudents] = useState([
        { id: 1, name: 'Emma Johnson', lessonsRemaining: 10 },
        { id: 2, name: 'Michael Chen', lessonsRemaining: 8 },
        { id: 3, name: 'Sophia Martinez', lessonsRemaining: 12 },
        { id: 4, name: 'James Wilson', lessonsRemaining: 5 },
        { id: 5, name: 'Olivia Brown', lessonsRemaining: 15 },
        { id: 6, name: 'Liam Davis', lessonsRemaining: 3 }
    ]);

    const handleCheckIn = (studentId) => {
        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.id === studentId
                    ? { ...student, lessonsRemaining: Math.max(0, student.lessonsRemaining - 1) }
                    : student
            )
        );
    };

    return (
        <div className="app">
            <header className="header">
                <h1>Ark Farms 🌾</h1>
                <p className="subtitle">Manage student attendance and lesson credits</p>
            </header>
            
            <div className="container">
                <div className="stats">
                    <div className="stat-card">
                        <span className="stat-number">{students.length}</span>
                        <span className="stat-label">Total Students</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            {students.reduce((sum, student) => sum + student.lessonsRemaining, 0)}
                        </span>
                        <span className="stat-label">Total Lessons</span>
                    </div>
                </div>

                <div className="student-list">
                    {students.map(student => (
                        <div key={student.id} className="student-card">
                            <div className="student-info">
                                <div className="student-avatar">
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="student-details">
                                    <h3 className="student-name">{student.name}</h3>
                                    <div className="lessons-info">
                                        <span className={`lessons-badge ${student.lessonsRemaining <= 3 ? 'low' : ''}`}>
                                            {student.lessonsRemaining} {student.lessonsRemaining === 1 ? 'lesson' : 'lessons'} remaining
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="check-in-btn"
                                onClick={() => handleCheckIn(student.id)}
                                disabled={student.lessonsRemaining === 0}
                            >
                                {student.lessonsRemaining === 0 ? 'No Lessons' : 'Check In'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
