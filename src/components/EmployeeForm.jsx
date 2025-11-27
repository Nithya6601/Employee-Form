import React, { useState, useEffect } from "react";

export default function EmployeeForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    dob: "",
    email: "",
    password: "",
    phone: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="card form">
      <h2>{initialData ? "Edit Employee" : "Add Employee"}</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          DOB
          <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
        </label>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>

        <div className="form-actions">
          <button className="btn primary" type="submit">
            {initialData ? "Save Changes" : "Add Employee"}
          </button>

          <button className="btn danger" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
