import { useEffect, useRef, useState } from "react";
import StudentModal from "./StudentModal";

const StudentList = () => {
    const [studentList, setStudentList] = useState([
        { name: "Manh", phone: "0123456789", email: "manh@gmail.com" },
        { name: "Trang", phone: "0123456789", email: "trang@gmail.com" },
        { name: "Quan", phone: "0123456789", email: "quan@gmail.com" },
        { name: "Duy", phone: "0123456789", email: "duy@gmail.com" },
        { name: "Linh", phone: "0123456789", email: "linh@gmail.com" },
        { name: "Nguyen", phone: "0123456789", email: "nguyen@gmail.com" },
    ]);

    const [filteredList, setFilteredList] = useState([...studentList]);

    const [form, setForm] = useState({ name: "", phone: "", email: "" });
    const [indexSelected, setIndexSelected] = useState(-1);
    const [isValid, setIsValid] = useState(false);
    const closeModal = useRef(null);

    const [search, setSearch] = useState({ name: "", phone: "", email: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const { name, phone, email } = form;
        const isValid = name && phone && email;
        setIsValid(isValid);
    }, [form]);

    useEffect(() => {
        document.title = "Student List";
    }, []);

    const handleSelect = (studentSelected, index) => {
        setForm({ ...studentSelected });
        setIndexSelected(index);
    };

    const handleChange = (event) => {
        const newForm = { ...form };
        newForm[event.target.name] = event.target.value;
        setForm({
            ...newForm,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid) {
            const newList = [...studentList];
            if (indexSelected > -1) {
                newList.splice(indexSelected, 1, form);
            } else {
                newList.push(form);
            }
            setForm({ name: "", phone: "", email: "" });
            setStudentList(newList);
            setIsValid(false);
            setIndexSelected(-1);
            console.log(closeModal);
        }
    };

    const handleDelete = (index) => {
        const newList = [...studentList];
        newList.splice(index, 1);
        setStudentList(newList);
    };

    useEffect(() => {
        let list = [...studentList];
        const { name, phone, email } = search;

        list = list.filter(
            (student) =>
                student.name.toLowerCase().includes(name.toLowerCase()) &&
                student.phone.includes(phone) &&
                student.email.toLowerCase().includes(email.toLowerCase())
        );

        list.sort((a, b) => a.name.localeCompare(b.name));

        setFilteredList(list);
        setCurrentPage(1);
    }, [search, studentList]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedList = filteredList.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="table-wrapper">
            <div className="table-title">
                <div className="row">
                    <div className="col-sm-6">
                        <h2>
                            Student <b>List</b>
                        </h2>
                    </div>
                    <div className="col-sm-6">
                        <a
                            href="#EmployeeModal"
                            className="btn btn-success"
                            data-toggle="modal"
                        >
                            <i className="material-icons">&#xE147;</i>{" "}
                            <span>Add New Employee</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Search Form */}
            <div className="search-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Search by name"
                    value={search.name}
                    onChange={(e) =>
                        setSearch({ ...search, name: e.target.value })
                    }
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Search by phone"
                    value={search.phone}
                    onChange={(e) =>
                        setSearch({ ...search, phone: e.target.value })
                    }
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Search by email"
                    value={search.email}
                    onChange={(e) =>
                        setSearch({ ...search, email: e.target.value })
                    }
                />
            </div>

            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th style={{width: "200px"}}>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {paginatedList.map((student, index) => (
                    <tr key={index}>
                        <td>{student.name}</td>
                        <td>{student.phone}</td>
                        <td>{student.email}</td>
                        <td>
                            <a
                                href="#EmployeeModal"
                                className="edit"
                                data-toggle="modal"
                                onClick={() => handleSelect(student, startIndex + index)}
                            >
                                <i
                                    className="material-icons"
                                    data-toggle="tooltip"
                                    title="Edit"
                                >
                                    &#xE254;
                                </i>
                            </a>
                            <a
                                href="#deleteEmployeeModal"
                                className="delete"
                                data-toggle="modal"
                                onClick={() => handleDelete(startIndex + index)}
                            >
                                <i
                                    className="material-icons"
                                    data-toggle="tooltip"
                                    title="Delete"
                                >
                                    &#xE872;
                                </i>
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {Array.from({length: totalPages}, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            <StudentModal
                name={form.name}
                email={form.email}
                phone={form.phone}
                indexSelected={indexSelected}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                isValid={isValid}
                closeModal={closeModal}
            />
        </div>
    );
};

export default StudentList;