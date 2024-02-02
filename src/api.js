

export const fetchUsers = () => {
    const users = JSON.parse(localStorage.getItem('userData')) || [];
    return users;
  };
  