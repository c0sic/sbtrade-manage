import React, { useState, useEffect } from "react";
import UserItem from "./UserItem";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { firestore, auth } from "../../../../../firebase";
import APP_STRINGS from "../../../../../util/strings";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const endUsersRef = firestore
      .collection("orgs")
      .doc(auth.currentUser.uid)
      .collection("endUsers");

    const unsubscribe = endUsersRef.onSnapshot((snapshot) => {
      const promises = snapshot.docs.map(async (doc) => {
        const usersDoc = await doc.ref.get();
        return usersDoc.data();
      });

      Promise.all(promises)
        .then((endUsersData) => {
          setUsers(endUsersData);
        })
        .catch((error) => {
          console.log("Error fetching users: ", error);
        });
    });

    return () => unsubscribe();
  }, []);

  const updateUserList = (userId, updatedData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updatedData } : user
      )
    );
  };

  return (
    <div className="content p-2">
      <div className="d-flex justify-content-between align-items-center">
        <h3>{APP_STRINGS.EU_END_USER}</h3>
        <Link to="/org/add-user">
          <Button variant="primary">{APP_STRINGS.EU_ADD_NEW}</Button>
        </Link>
      </div>
      <ul className="mt-3">
        {users.map((user) => (
          <UserItem key={user.id} user={user} updateUserList={updateUserList} />
        ))}
      </ul>
    </div>
  );
};

export default Users;
