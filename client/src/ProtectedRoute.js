import React, { Component } from 'react';
import {Redirect,Route,Switch} from 'react-router'
import Auth from './auth';


export const ProtectedRoute = ({component: Component, ...rest}) => {
    return (
        <Route 
          {...rest}
          render={props => {
              if(Auth.isAuthenticated()){
              //if(true){
                  return <Component {...props} />
              } else {
                return (
                    <Redirect
                      to={{
                        pathname: "/",
                        state: {
                          from: props.location
                        }
                      }}
                    />
                ) 
              }
          }}
        />
    )
}
