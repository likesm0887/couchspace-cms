import { Navigate, Outlet } from "react-router-dom";
export const adminAuthentication = {
    isAuthenticated: false,
    updateAuthentication(value) {
        this.isAuthenticated = value;
    }
};

export const counselorAuthentication = {
    isAuthenticated: false,
    updateAuthentication(value) {
        this.isAuthenticated = value;
    }
};
function ProtectedRoute({ redirectPath, isAdmin }) {
    let isAuthenticated = isAdmin ? adminAuthentication.isAuthenticated : counselorAuthentication.isAuthenticated;
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
}

export default ProtectedRoute;