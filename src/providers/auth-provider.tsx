
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demo
const DEMO_USERS = [
  {
    id: "1",
    username: "demo",
    email: "demo@example.com",
    password: "password123",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is stored in localStorage on component mount
    const storedUser = localStorage.getItem("synergy-user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("synergy-user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes only - in a real app, this would be an API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem("synergy-user", JSON.stringify(userWithoutPassword));
        toast.success(`Welcome back, ${foundUser.username}!`);
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = DEMO_USERS.find((u) => u.email === email);
      
      if (existingUser) {
        toast.error("User with this email already exists");
        return false;
      }
      
      // In a real app, this would create a user in the database
      const newUser = {
        id: (DEMO_USERS.length + 1).toString(),
        username,
        email,
        password,
      };
      
      DEMO_USERS.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("synergy-user", JSON.stringify(userWithoutPassword));
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("synergy-user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
