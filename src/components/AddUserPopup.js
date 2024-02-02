import React, { useState, useEffect } from 'react';
import './AddUserPopup.css';

const AddUserPopup = ({ isOpen, onClose, onSubmit, editUser }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    status: 'active' // Default value for status
  });

  useEffect(() => {
    if (editUser) {
      setFormData(editUser);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        status: 'active' // Default value for status
      });
    }
  }, [editUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Save to local storage
    const usersFromLocalStorage = JSON.parse(localStorage.getItem('userData')) || [];
    const updatedUsers = editUser
      ? usersFromLocalStorage.map((user, index) => (index === editUser.index ? formData : user))
      : [...usersFromLocalStorage, formData];
    localStorage.setItem('userData', JSON.stringify([...updatedUsers,...updatedUsers]));
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <span className="close" onClick={onClose}>×</span>
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddUserPopup;
