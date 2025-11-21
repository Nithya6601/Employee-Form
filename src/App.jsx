import React, { useEffect, useState } from "react";
import "./index.css";

const STORAGE_KEY = "employees";

/** Basic validators */
const validators = {
  name: (v) => v.trim().length >= 2 || "Name must be at least 2 characters",
  dob: (v) => !!v || "Date of Birth is required",
  email: (v) =>
    /\S+@\S+\.\S+/.test(v) || "Please enter a valid email address",
  password: (v) => v.length >= 6 || "Password must be at least 6 characters",
  phone: (v) =>
    /^\d{10}$/.test(v) || "Phone must be 10 digits (numbers only)",
};

function loadEmployees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEmployees(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function App() {
  const [employees, setEmployees] = useState(() => loadEmployees());
  const [form, setForm] = useState({
    id: "",
    name: "",
    dob: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  function validateAll() {
    const e = {};
    Object.entries(validators).forEach(([key, fn]) => {
      const result = fn(form[key]);
      if (result !== true && result !== undefined && result !== false) {
        // validator returns string message on failure
        if (result !== true) e[key] = result;
      } else if (result === false) {
        e[key] = "Invalid value";
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  }

  function resetForm() {
    setForm({
      id: "",
      name: "",
      dob: "",
      email: "",
      password: "",
      phone: "",
    });
    setErrors({});
    setIsEditing(false);
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validateAll()) return;

    if (isEditing) {
      setEmployees((list) =>
        list.map((it) => (it.id === form.id ? { ...form, showJSON: it.showJSON || false } : it))
      );
    } else {
      const newEmp = { ...form, id: `emp_${Date.now()}`, showJSON: false };
      setEmployees((list) => [newEmp, ...list]);
    }
    resetForm();
  }

  function handleEdit(id) {
    const found = employees.find((e) => e.id === id);
    if (!found) return;
    setForm(found);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    if (!confirm("Delete this employee?")) return;
    setEmployees((list) => list.filter((e) => e.id !== id));
  }

  function handleToggleJSON(id){
    setEmployees((list) => 
    list.map((e) => 
    e.id === id ? {...e, showJSON: !e.showJSON }: e));
  }

  function handleExportJSON() {
    const dataStr = JSON.stringify(employees, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container">
      <h1>Employee Form — Save to localStorage</h1>

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <h2>{isEditing ? "Edit Employee" : "Add Employee"}</h2>

        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
          />
          {errors.name && <small className="err">{errors.name}</small>}
        </label>

        <label>
          DOB
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
          />
          {errors.dob && <small className="err">{errors.dob}</small>}
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@mail.com"
          />
          {errors.email && <small className="err">{errors.email}</small>}
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 chars"
          />
          {errors.password && <small className="err">{errors.password}</small>}
        </label>

        <label>
          Phone
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10 digit number"
            inputMode="numeric"
          />
          {errors.phone && <small className="err">{errors.phone}</small>}
        </label>

        <div className="form-actions">
          <button type="submit" className="btn primary">
            {isEditing ? "Save changes" : "Add employee"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (Object.values(form).some((v) => v)) {
                if (!confirm("Discard changes?")) return;
              }
              resetForm();
            }}
          >
            Reset
          </button>
        </div>
      </form>

      <div className="card table-wrap">
        <div className="table-header">
          <h2>Employees ({employees.length})</h2>
          <div>
            <button className="btn" onClick={() => { setEmployees([]); localStorage.removeItem(STORAGE_KEY); }}>
              Clear All
            </button>
            <button className="btn" onClick={handleExportJSON}>
              Export JSON
            </button>
          </div>
        </div>

        {employees.length === 0 ? (
          <p className="muted">No employees yet. Add one using the form above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>DOB</th>
                <th>Email</th>
                <th>Phone</th>
                <th>JSON</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td data-label="Name">{emp.name}</td>
                  <td data-label="DOB">{emp.dob}</td>
                  <td data-label="Email">{emp.email}</td>
                  <td data-label="Phone">{emp.phone}</td>
                  <td data-label="JSON">
                    <button className="btn smal" onClick={() => handleToggleJSON(emp.id)}>
                      {emp.showJSON ? "Hide JSON" : "Show JSON"}
                    </button>
                    {emp.showJSON && (
                      <pre className="json">{JSON.stringify(emp, null, 2)}</pre>
                    )}
                  </td>
                  <td className="actions" data-label="Actions">
                    <button className="btn small" onClick={() => handleEdit(emp.id)}>Edit</button>
                    <button className="btn small danger" onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer style={{ marginTop: 20 }}>
        <small className="muted">
          Note: This demo stores data in <code>localStorage</code>. Passwords are stored as plain text for demo only.
        </small>
      </footer>
    </div>
  );
}