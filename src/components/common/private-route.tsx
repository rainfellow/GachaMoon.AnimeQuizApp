import React, { type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";

interface IPrivateRouteProps {
    component: ReactElement;
}

// <Route path='*PATH*' element={<PrivateRoute component={*COMPONENT*} />} />
export const PrivateRoute: React.FC<IPrivateRouteProps> = ({ component }): ReactElement => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated() != null
        ? (<div>{component}</div>)
        : (
            <Navigate to={{ pathname: "/auth/sign-in" }}/>
        );
};
