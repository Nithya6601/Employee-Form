import React from "react";

export default function EmployeeTable({
  employees,
  onAdd,
  onEdit,
  onDelete,
  onExportCSV,
  onExportJSON,
  onExportExcel,
}) {
  return (
    <div className="card table-wrap">
      <div className="table-header">
        <h2>Employees ({employees.length})</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn" onClick={onExportCSV}>CSV</button>
          <button className="btn" onClick={onExportExcel}>Excel</button>
          <button className="btn" onClick={onExportJSON}>JSON</button>
          <button className="btn primary" onClick={onAdd}>
            + Add Employee
          </button>
        </div>
      </div>

      {employees.length === 0 ? (
        <p>No employees yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>DOB</th>
              <th>Email</th>
              <th>Phone</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.dob}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>

                <td>
                  <button className="btn small" onClick={() => onEdit(emp)}>
                    Edit
                  </button>
                  <button
                    className="btn small danger"
                    onClick={() => onDelete(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
