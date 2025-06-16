import { useEffect, useState } from 'react';

function Lessons() {
  const [subjectName, setSubjectName] = useState('');
  const [progress, setProgress] = useState(null);
  const [recommended, setRecommended] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
  setSubjectName('Subject: German');
  setProgress({ completed: 5, total: 10 });
  setRecommended({ type: 'Quiz', title: 'Chapter 3: Algebra Practice' });
  setAssignments([
    { title: 'Assignment 1', due: '2025-06-30' },
    { title: 'Assignment 2', due: '2025-07-10' },
  ]);
}, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{subjectName}</h1>

      <h3>Progress</h3>
      {progress && (
        <p>
          {progress.completed} out of {progress.total} lessons completed
        </p>
      )}

      <h3>Next Recommended Activity</h3>
      {recommended ? (
        <p>
          {recommended.type}: {recommended.title}
        </p>
      ) : (
        <p>Loading recommended content...</p>
      )}

      <h3>Assignments</h3>
      {assignments.length > 0 ? (
        <ul>
          {assignments.map((a, i) => (
            <li key={i}>
              {a.title} — Due: {a.due}
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments available</p>
      )}
    </div>
  );
};

export default Lessons;
