# ByteBox Recipe App

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Installation

Tested on Python 3.10.9

1. (Optional) Set up virtual environment for Python

    `cd backend`

    Create the virtual environment with `virtualenv venv`

    Then activate it:

    On Linux: `source venv/bin/activate`

    On Windows using Command Prompt: `path\to\venv\Scripts\activate.bat`

    On Windows using PowerShell: `path\to\venv\Scripts\Activate.ps1`

2. Install dependencies
 
```
pip install flask
pip install python-dotenv
pip install pymongo
```
3. Nodejs and dependencies

```
apt install nodejs
npm install npx
npm install axios
```
4. Mongodb

```
apt install mongodb
```
It runs as a service by default on linux. You can enable or disable it using `systemctl enable mongodb` or `systemctl disable mongodb`. You can check its status using `systemctl status mongodb`.

You can also run it as daemon in the commandline using `mongod`


## Usage
1. Open the project in a terminal
1. `cd backend`
2. `source venv/bin/activate` (If you're using a virtual environment)
3. `python -m flask run` to launch the backend
4. Open another terminal
5. `cd frontend`
6. `npm start`
7. Navigate to "http://localhost:3000" in your web browser

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.
