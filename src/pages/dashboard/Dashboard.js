import React, { useEffect, useState, useMemo } from "react";
import { useGlobalContext } from "../../context/appContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const {
    user: currentUser,
    isAuthenticated,
    searchUsers,
    searchNewUsers,
  } = useGlobalContext();

  const navigate = useNavigate();
  const [searchUser, setSearchUser] = useState("");

  const handleChat = (user) => {
    navigate(`/dashboard/chat/${user.id}`);
  };

  useEffect(() => {
    try {
      searchUsers({ searchUser });
    } catch (error) {
      console.log(error);
    }
  }, [searchUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div>
        <div className="position-relative">
          <input
            type="text"
            name="searchUser"
            value={searchUser}
            placeholder="Search users.."
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <div className="position-absolute overflow-auto">
            {searchNewUsers.map((user, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleChat(user)}
                  className="text-primary"
                >
                  {user.username}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
