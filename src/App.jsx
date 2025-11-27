import React, { useEffect, useState } from "react";
import "./index.css";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";
import * as XLSX from "xlsx";

const STORAGE_KEY = "employees";

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
  const [employees, setEmployees] = useState(loadEmployees);
  const [view, setView] = useState("table");
  const [editEmployee, setEditEmployee] = useState(null);

  useEffect(() => {
    saveEmployees(employees);
  }, [employees]);

  const handleAdd = (data) => {
    setEmployees((prev) => [
      { ...data, id: `emp_${Date.now()}` },
      ...prev,
    ]);
    setView("table");
  };

  const handleEdit = (data) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === data.id ? data : emp))
    );
    setEditEmployee(null);
    setView("table");
  };

  const handleDelete = (id) => {
    if (confirm("Delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  /* -----------------------------
      EXPORT: CSV
  ------------------------------ */
  function exportCSV() {
    if (employees.length === 0) {
      alert("No employee data to export.");
      return;
    }

    const header = ["Name", "DOB", "Email", "Phone"];
    const rows = employees.map((emp) => [
      emp.name,
      emp.dob,
      emp.email,
      emp.phone,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "employees.csv";
    link.click();
  }

  /* -----------------------------
      EXPORT: JSON
  ------------------------------ */
  function exportJSON() {
    const jsonStr = JSON.stringify(employees, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  /* -----------------------------
      EXPORT: EXCEL (.xlsx)
  ------------------------------ */
  function exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    XLSX.writeFile(workbook, "employees.xlsx");
  }

  return (
    <div className="container">
      {view === "table" ? (
        <EmployeeTable
          employees={employees}
          onAdd={() => setView("form")}
          onEdit={(emp) => {
            setEditEmployee(emp);
            setView("form");
          }}
          onDelete={handleDelete}
          onExportCSV={exportCSV}
          onExportJSON={exportJSON}
          onExportExcel={exportExcel}
        />
      ) : (
        <EmployeeForm
          initialData={editEmployee}
          onCancel={() => {
            setEditEmployee(null);
            setView("table");
          }}
          onSubmit={(data) =>
            editEmployee ? handleEdit(data) : handleAdd(data)
          }
        />
      )}
    </div>
  );
}
