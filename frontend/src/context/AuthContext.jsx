import { createContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Lazy Initialization To Prevent State Errors
    const [user, setUser] = useState(() => {
        const userInfo = localStorage.getItem("userInfo");
        return userInfo ? JSON.parse(userInfo) : null;
    });

    // LOGIN FUNCTION
    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post(
                "http://localhost:5000/api/users/login",
                { email, password },
                config
            );

            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    };

    // NEW: REGISTER FUNCTION (Fixes The Logic Gap)
    const register = async (name, email, password) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            // Connects To The Backend Register Route We Created In Phase 2
            const { data } = await axios.post(
                "http://localhost:5000/api/users",
                { name, email, password },
                config
            );

            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;