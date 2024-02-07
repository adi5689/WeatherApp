import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase"; // Import your db instance from firebase.js

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [username, setUsername] = useState(""); // State for the username input

  const usersCollection = collection(db, "weatherapp_users");
  

  useEffect(() => {
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersArray);
    });

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  console.log(users);


  const filteredUsers = users
    .filter((user) =>
      user.email?.toLowerCase()?.includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.email.localeCompare(b.email);
      } else {
        return b.email.localeCompare(a.email);
      }
    });

  const handleAddUser = async () => {
    try {
      const newUser = {
        username: username, // Use the provided username
        createdAt: new Date().toISOString(), // Current date and time
        status: "active",
      };
      await addDoc(usersCollection, newUser);
      setUsername(""); // Clear the username input after adding the user
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "weatherapp_users", userId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleChangeStatus = async (userId, newStatus) => {
    try {
      await updateDoc(doc(db, "weatherapp_users", userId), {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>USERS</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Filter by username"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: ".5rem",
          }}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: ".5rem",
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: ".5rem",
          }}
        />
        <button
          onClick={handleAddUser}
          style={{
            backgroundColor: "#007BFF",
            color: "#fff",
            borderRadius: "4px",
            padding: ".5rem .75rem",
            cursor: "pointer",
          }}
        >
          Add User
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                padding: ".5rem",
                textAlign: "left",
                backgroundColor: "#f8f9fa",
              }}
            >
              Username
            </th>
            <th
              style={{
                padding: ".5rem",
                textAlign: "left",
                backgroundColor: "#f8f9fa",
              }}
            >
              Created At
            </th>
            <th
              style={{
                padding: ".5rem",
                textAlign: "left",
                backgroundColor: "#f8f9fa",
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: ".5rem",
                textAlign: "left",
                backgroundColor: "#f8f9fa",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: ".5rem", borderTop: "1px solid #dee2e6" }}>
                {user.email}
              </td>
              <td style={{ padding: ".5rem", borderTop: "1px solid #dee2e6" }}>
                {new Date(user.createdAt).toLocaleString()}
              </td>
              <td style={{ padding: ".5rem", borderTop: "1px solid #dee2e6" }}>
                {user.status}
              </td>
              <td style={{ padding: ".5rem", borderTop: "1px solid #dee2e6" }}>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  style={{
                    color: "#dc3545",
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() =>
                    handleChangeStatus(
                      user.id,
                      user.status === "active" ? "inactive" : "active"
                    )
                  }
                  style={{
                    color: "#28a745",
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                    marginLeft: ".5rem",
                  }}
                >
                  Toggle Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
