import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../services/projectService';
import { getUsers } from '../services/budgetService';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    managerId: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      alert("Name is required");
      return;
    }
    try {
      if (editingProject) {
        // update mode
        await updateProject(editingProject.id, form);
        setEditingProject(null);
      } else {
        // create mode
        await createProject(form);
      }
      fetchProjects();
      setForm({ name: '', description: '', managerId: '' });
    } catch (err) {
      console.error(err);
      alert("Error saving project");
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name,
      description: project.description || '',
      managerId: project.manager?.id || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setForm({ name: '', description: '', managerId: '' });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Name *</label>
          <input
            type="text"
            placeholder="Project Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Manager</label>
          <select
            value={form.managerId}
            onChange={e => setForm({ ...form, managerId: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="">None</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingProject ? "Update Project" : "Add Project"}
          </button>
          {editingProject && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Project list */}
      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <p><strong>Name:</strong> {p.name}</p>
              <p><strong>Description:</strong> {p.description || '-'}</p>
              <p><strong>Manager:</strong> {p.manager?.name || '-'}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(p)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
