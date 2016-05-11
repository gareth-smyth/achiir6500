# Summary
This unofficial control software for the ACHI IR6500 Infrared BGA Rework Station is made up of
* A .net (windows tested only) server which exposes a restful interface allowing communication with the ACHI 6500 over
COM1.
* A web based GUI to interact with the restful interface

# Projects
The source is split into the following components
* **web_gui** - An ES6 react based web project which displays data from the rework station  and allowing commands to be
sent
* **server** - A C#.NET project which starts up a NancyFx webserver to offer REST endpoints described below
* **server_mock** - A C#.NET version of the real server which does silently swallows any commands which should directly
communicate with the rework station
* **server_test** - A C#.NET test project that tests (in a limited way) the workings of the server
* **cli** - a quick command line program used to set things up and test them when directly connected to a rework station

# Build
**Server**  
The .NET components have been built using Microsoft Visual Studio Community 2015.  The `achiir6500.sln` file can be
opened and the build should take care of itself.

You can also run `grunt msbuld:server` from the web_gui folder

**GUI**  
The web gui has been built using node, npm, grunt, react, chartjs and various other libraries (see package.json). There
isn't a whole lot in the way of grunt task set up but the basic steps to get the serer up and running are
* cd web_gui
* npm install
* grunt build

#Test
**Server**
Nunit can be used to test (tested with nunit3).

You can also run `grunt server-test` from the commandline.

The nunit console and opencover executables have to be on your PATH.

On my system the folders are `C:\Program Files (x86)\NUnit.org\nunit-console`. and `C:\Program Files (x86)\OpenCover`

# Run In Development
**Server**  
* Run the server_mock project for test isolated from the rework station
* Run the server project to test against an actual instance of the rework station exposed on COM1  

The server should now be exposed on http://localhost:9858 - try hitting http://localhost:9858/programs to see if the
server is running.

**GUI**  
* cd web_gui
* grunt serve

The front end should then be visible from http://localhost:9000/index.html

![achiir6500](https://cloud.githubusercontent.com/assets/6697040/14029172/8d200044-f1f8-11e5-88aa-75863bff3aac.PNG)

# Deployment
Perform a release build of the server project in visual studio - this will copy all of the required files (server and
front end) to the content folder in root.  This is a  little flaky at the minute and executes npm install so needs an
internet connection.  If it fails, try it again.
