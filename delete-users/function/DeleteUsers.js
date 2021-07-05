"use strict";
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

function getDaysOfExistenceUser(registrationDate) {
    return Math.floor((Date.now() - Date.parse(registrationDate)) / (60*60*24*1000));
}

function existMoreThen(registrationDate, maxDaysExistence) {
    return registrationDate && getDaysOfExistenceUser(registrationDate) > maxDaysExistence;
}

const deleteAllTestUsers = async(userPoolId, usernameRegex, maxDaysExistence) => {
    const data = await cognito.listUsers({UserPoolId: userPoolId}).promise();
    await Promise.all(data.Users.map(u => {
        if (u.Username.match(usernameRegex) || existMoreThen(u.UserCreateDate, maxDaysExistence)) {
            console.log(`Delete: ${u.Username}`);
            return cognito.adminDeleteUser({UserPoolId: userPoolId, Username: u.Username}).promise();
        } else {
            return Promise.resolve();
        }
    }));
};

const main = async() => {
    cognito.region = process.env.AWS_REGION;
    return deleteAllTestUsers(process.env.USER_PULL_ID, process.env.NAME_REGEX, process.env.MAX_DAYS_EXISTENCE);
};

exports.lambdaHandler = main;