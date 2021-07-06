"use strict";
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

function isTestUser(user, usernameRegex, maxDaysExistence) {
    return user.Username.match(usernameRegex) || existMoreThen(user.UserCreateDate, maxDaysExistence);
}

function getDaysOfExistenceUser(registrationDate) {
    return Math.floor((Date.now() - Date.parse(registrationDate)) / (60*60*24*1000));
}

function existMoreThen(registrationDate, maxDaysExistence) {
    return maxDaysExistence == 0 ? false : getDaysOfExistenceUser(registrationDate) > maxDaysExistence;
}

const deleteAllTestUsers = async(userPoolId, usernameRegex, maxDaysExistence) => {
    const data = await cognito.listUsers({UserPoolId: userPoolId}).promise();

    await Promise.all(data.Users.filter(user => isTestUser(user, usernameRegex, maxDaysExistence))
        .map(user => {
            console.log(`Deleting: ${user.Username}`);
            return cognito.adminDeleteUser({UserPoolId: userPoolId, Username: user.Username}).promise();
        }));
};

const main = async() => {
    cognito.region = process.env.AWS_REGION;
    return deleteAllTestUsers(process.env.USER_PULL_ID, process.env.NAME_REGEX, process.env.MAX_DAYS_EXISTENCE);
};

exports.lambdaHandler = main;