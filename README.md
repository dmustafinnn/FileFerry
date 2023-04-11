# FileFerry - A Secure File Sharing Platform (MongoDB)

Welcome to the GitHub repository for FileFerry, a web-based file sharing platform built with MongoDB.

Developers: 
- Dias Mustafin ([@dmustafinnn](https://github.com/dmustafinnn))
- Sasanka Kosuru ([@ksasanka11](https://github.com/ksasanka11))
- Anahita Dinesh ([@anahita20](https://github.com/anahita20))

## Getting Started
1. Make sure you have Docker Desktop installed on your computer.
2. From the project root directory, run the following command to build the Docker containers:
    ```
    docker-compose build
    ```
3. After the build is complete, start the Docker containers by running the following command:
    ```
    docker-compose up
    ```
4. The following table shows the ports used by each container:
    | Service | Container Name | Port |
    | ------- | -------------- | ---- |
    | Frontend | fileferry-client | 3000 |
    | Backend | fileferry-server | 5000 |
    | Database | fileferry-db | 27017 |

## Milestones
You can view the latest milestones and their progress here: [FileFerry-Milestones](https://docs.google.com/spreadsheets/d/e/2PACX-1vR92wZZyTgUng5knBInbccaXzKSGQ3wc3oqaCNuSMUT2Qdu1iKcwMNZL-YHT5jovbqIwdHiElc-_sPf/pubhtml?gid=0&single=true)
- Login page UI and APIs
- User registeration APIs
- Securing APIs with auth tokens
- Dashboard UI
- APIs to add and delete users from whitelist

## Usage
Once you have the project set up and running, you can access the FileFerry application by navigating to `http://localhost:3000` in your web browser. From there, you can use the platform to upload, download, and share files with others.
