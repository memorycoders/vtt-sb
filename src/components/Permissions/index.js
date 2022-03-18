import React from 'react';
import { connect } from 'react-redux';
import { USER_ROLES } from './constants';

const mapStateToProps = (state) => {
    return {
        userRole: state?.auth?.user?.userRole
    }
}

const mapDispatchToProps = {};


export const RequireAMRole = connect(mapStateToProps, mapDispatchToProps)(({children, userRole}) => {
    return (
        userRole === USER_ROLES.AM ? children : null
    )
});


export let RequireManagerRole = connect(mapStateToProps, mapDispatchToProps)(({children, userRole}) => {
    return (
        userRole === USER_ROLES.MANAGER ? children : null
    )
});

export let RequireOCSRole = connect(mapStateToProps, mapDispatchToProps)(({children, userRole}) => {
    return (
        userRole === USER_ROLES.OCS ? children : null
    )
});

export let RequireAdminRole = connect(mapStateToProps, mapDispatchToProps)(({children, userRole}) => {
    return (
        userRole === USER_ROLES.ADMIN ? children : null
    )
});



