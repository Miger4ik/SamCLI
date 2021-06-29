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

const main = async(event) => {
    console.log('Event:', event);

    let region = process.env.AWS_REGION;
    let regex = process.env.NAME_REGEX;
    let pullId = process.env.USER_PULL_ID;
    console.log(`REGION: ${region}`);
    console.log(`REGEX: ${regex}`);
    console.log(`PULL_ID: ${pullId}`);
    

    cognito.region = region;
    return clearAllTestUsers(event.userPollId, event.usernameRegex);
};

exports.lambdaHandler = main;
// js-lambda-delete-users
// something changes

