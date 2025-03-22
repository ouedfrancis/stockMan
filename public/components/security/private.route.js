import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = (props) => {
     //isAuthorized // determine if authorized, from context or however you're doing it

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    //console.log("vfffff",props.isAuthorized)
    return props.isAuthorized ? <Outlet /> : <Navigate to="/403" />;
}
export default PrivateRoute;