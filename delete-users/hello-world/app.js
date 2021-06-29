"use strict";
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const deleteUser = async(UserPoolId, Username) => {
    return await new Promise((resolve, reject) => {

        cognito.adminDeleteUser({UserPoolId, Username}, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const clearAllTestUsers = async(userPollId, usernameRegex) => {
    return await new Promise((resolve, reject) => {

        const params = {
            UserPoolId: userPollId, 
            AttributesToGet: null,
            Filter: null,
            Limit: null,
            PaginationToken: null
        };

        cognito.listUsers(params, async (err, data) => {
            if (err) {
                reject(err);
            } else {
                await Promise.all(data.Users.map(u => {
                    if (u.Username.match(usernameRegex)) {
                        console.log(`Deleting: ${u.Username}`);
                        return deleteUser(userPollId, u.Username);
                    } else {
                        return null;
                    }
                }));
                resolve(data);
            }
        });
    });
};

const main = async() => {
    cognito.region = process.env.AWS_REGION;
    return clearAllTestUsers(process.env.USER_PULL_ID, process.env.NAME_REGEX);
};

exports.lambdaHandler = main;
// js-lambda-delete-users
// something changes

