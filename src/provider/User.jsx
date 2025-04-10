import React, { useContext, useEffect, useState } from "react";
// import { useProfileQuery } from "../redux/apiSlices/authSlice"
export const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  // const {data: profile} = useProfileQuery({});
  const [user, setUser] = useState(null);

  const profile = {
    firstName: "Test",
    lastName: "User",
    email: "test082@gmail.com",
    mobileNumber: "01812038369",
    location: "Dhaka,Bangladesh",
    image:
      "https://avatars.design/wp-content/uploads/2021/02/corporate-avatars-TN-1.jpg",
  };

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, []); //[profile]

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
