import { useState } from "react";
import { addClass, addStudentToClass, getAllStudents, getClasses } from "../../api";
import { useEffect } from "react";

function AddClass() {
    const token = localStorage.getItem("token");

    const [allStudents, setAllStudents] = useState([]);
    const [className, setClassName] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("");
    const [teacherClasses, setTeacherClasses] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const students = await getAllStudents(token);
                setAllStudents(students);
            } catch (err) {
                console.error("Failed to fetch students:", err.message);
            }
        };
        fetchStudents();

        const fetchTeacherClasses = async () => {
            try {
                const classes = await getClasses(token);
                if (classes) {
                    setTeacherClasses(classes);
                }
                console.log(classes);
            } catch (err) {
                console.error("Error fetching teacher classes:", err);
            }
        };
        fetchTeacherClasses();
    }, [token]);

    const assignStudentToClass = async () => {
        if (!selectedClassId || !selectedStudentId) return;
        try {
            const data = await addStudentToClass(selectedClassId, selectedStudentId);
            alert(data.message);
        } catch (err) {
            console.error("Error assigning student:", err);
            alert("Failed to assign student.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        await addClass(className, isActive);
        const updatedClasses = await getClasses(token)
        setTeacherClasses(updatedClasses);
        setResponseMsg(`Class created successfully.`);
        setClassName("");
        setIsActive(false);
        } catch (err) {
        console.error(err);
        setResponseMsg(`Failed to create class: ${err.message}`);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Create a New Class</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class name"
            className="w-full p-2 border rounded"
            required
            />
            <label className="flex items-center space-x-2">
            <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
            />
            <span>Active</span>
            </label>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Class
            </button>
        </form>
        <h3 className="font-medium text-lg mt-8 mb-2">Assign Student to Class</h3>
<div className="space-y-2">
    <select
        value={selectedClassId}
        onChange={(e) => setSelectedClassId(e.target.value)}
        className="w-full border p-2 rounded"
    >
        <option value="">Select Class</option>
        {teacherClasses.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
        ))}
    </select>

    <select
        value={selectedStudentId}
        onChange={(e) => setSelectedStudentId(e.target.value)}
        className="w-full border p-2 rounded"
    >
        <option value="">Select Student</option>
        {allStudents.map((student) => (
            <option key={student.id} value={student.id}>
                {student.name} ({student.email})
            </option>
        ))}
    </select>

    <button
        onClick={assignStudentToClass}
        className="bg-green-600 text-white px-4 py-2 rounded"
    >
        Assign Student
    </button>
</div>
        {responseMsg && <p className="mt-4 text-sm">{responseMsg}</p>}
        </div>
    );
}

export default AddClass;