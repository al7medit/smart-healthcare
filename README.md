# Smart healthcare app
The healthcare app is meant to offer a consolidated view, one portal, where all the data that is generated by a patient's medical devices can be consolidated into one view - dashboard, and reports, accessible by healthcare professionals and patients.

# Data
Currently, we are retrieving devices data available by the tidepool api and simulating some other data.
- /tidepool/scheduleInitializeData, schedules "tidepool/pullData" a long running script to retrieve the data of the healthcare professional with details available in the file tidepool/config
- tidepool/pullData, will retrieve a session token, healthcare professional info and healthcare professional related patients and creates users under scriptr account. Healtcare professional scriptr users will belong to group clinic, whereas patients users will belong to group patient.
For each patient, "tidepool/pullPatientData" is scheduled as long running script.
- tidepool/pullPatientData script, retrieve the cbg and smbg events of the a patient and stores the events in scriptr
- tidepool/simulator/createPatient, creates a simulated patient "marvette@scriptr.io" with healtcare professional userid equal in  to the healtcare userid retrieved for the healtcare in the "tidepool/config".
- tidepool/simulator/generatePatientsDevicesEvent, can be executed to generate a cbg and smbg event similar to the patient detail events retrieved from tidepool. The event is published to the deviceDigest channel to be ingested by the subscribed script app/api/subscription/subscriber.


   
# How to view the application
The installation API "app/install/auto.install.scriptr" needs to be executed once.

Preliminary to that you need to activate long queues on your scriptr account.

The Installation API "app/install/auto.install.scriptr" to install the app dependencies:
- The channels needed by the application.
- A default subdomain for the account, if not available.
- Create the application user roles "clinic" & "patient"
- etc..

# Dependencies 
- Underscore module.
- Momentjs module
- Hogan module.
- login module can be installed from custom modules from the scriptrdotio public repo UIComponents/login. Login module needs to be configured to redirect on successful login to "/healthcare/index.html". This is done in the file login/view/javascript/config.js in the config redirect. 

     
To visualize your device data in real-time, open the script "healthcare/view/html/login.html" and click View.

If you want to login as a healthcare user shamly@telecareus.com/demo
You will land on a map with a cluster view of the patients.

If you want to login as a patient user, you can choose one of two:
- demo-jill@tidepool.org/demo
- marvette@scriptr.io/demo

Zooming into the map and clicking on a marker will display an info window with the latest data the patient devices has published. You can click on view dashboard to view a detailed dashboard of a the patient devices.

Clicking on alerts lists all the logged events alerts from the patient devices.

As your device starts pushing data the dashboard and the map will reflect the new readings from your devices automatically.

- Your application is deployed to your account with a package version of the [UIComponents](https://github.com/scriptrdotio/UIComponents) module which you can find under app/view/build/. If you wish to use an unpackaged version of the [UIComponents](https://github.com/scriptrdotio/UIComponents) module and modify it, replace index.html with index.unpackage.html and checkout the master branch of [UIComponents](https://github.com/scriptrdotio/UIComponents). Read more about it [here](https://github.com/scriptrdotio/https://github.com/scriptrdotio/device-agnostic-app/tree/master/app/view/build/Readme.md).

# About the code
This section gives you an overview of the structure of the application and describes the responsibilities of the different scripts and files that compose it.

## app/api folder
The api folder contains scripts that define the API of the application, i.e. they are used by clients, such as the user interface (UI) or the client application running on the devices.

- app/api/subscription/subscriber: this script is subscribed to the deviceDigest channel and would consume all the messages containing the measurements made by the device's sensors.
"app/api/subscription/subscriber" uses "entities/devicemanager" to persit the data. It uses "entities/deviceevaluator" to check for the occurrence of alerts. 
The script also uses "entities/devicePublisher" to publish the received data in real-time to the UI.
- api/getPatientAlerts: this script is invoked by the UI to obtain the list of the alerts that were triggered by the application for selected or logged in patient. This list is actually obtained from "entities/deviceManager". Passing the "filter" parameter narrows the list to the alerts related to the patient with and id matching the value of "filter". 
- api/getPatientHistory: this script is invoked by the UI to obtain the list of all the events that occurred through time for a a selected patient or logged in patient. 
- api/getLatestPatients: this script is invoked by the map UI to obtain the latest events of all patients of the logged in healthcare, or of the logged in patient.
- api/getPatientLatest: this script is invoked by the UI to obtain the latest events of select or logged in patient.
- api/getPatients: this script is invoked by the UI to obtain the list of patients of the logged in healthcare.

## /entities folder
This folder contains the scripts that implement the business logic and business rules of the application. 

- /entities/deviceManager: this script is responsible for managing device data and persiting them in the "Default" data store of your account (**note:** to view your data stores, click on "Tools" in the scriptr.io workspace toolbar, then click on "Data Explorer").
- /entities/deviceevaluator: the deviceEvaluator receives device data and applies business rules on them to determine if an alert should be raised. Business rules are defined in a decision table ("/entities/rules/decisionTable"), which is loaded and executed by the entities/deviceevaluator script (**note:** decision tables are standalone API, i.e. you can send them requests - e.g. http requests - or you can execute them from within a script by using the **sdtLibScript.execute()** utility. Check "/entities/utils" for details)
- /entities/devicePublisher: the devicePublisher reads the latest updates from the deviceManager, transforms them into a format that suits the expectations of the charts in the UI, and broadcasts them to the latter by publishing the data into the "responseChannel"  channel (**note:** we use channels in scriptr.io to broadcast messages in real-time to other components, such as for example UI components). The charts in the UI are subscribed to the channel upon installation of the application and therefore, will automatically reflect data updates as soon as they are ingested (app/api/subscription/subscriber).
- /entities/utils: a utility script that contains utility functions, such as format(), to transform incoming device data into a structure that is expected by the UI
-/entities/rules/decisionTable: a decision table that defines the conditions to generate an alert (some threshold values). You can modify these rules visually from the scriptr.io workspace (the script opens in a decision table editor)

## /entities/actions
This folder contains two utility scripts for applying email templates.
- /entities/actions/emailOnAlert: a simple script that applies an email template to some content, before sending it using scriptr.io's  built-in "sendMail()" function. Emails are sent to the patient healthcare responsable email.
- /entities/actions/templates: simple email template definition for alerts

## /cleanup
This folder contains a script to cleanup the devices events data
- /cleanup/schedule: it schedules /cleanup/devicesEvents as a long executing script.
- /cleanup/devicesEvents: a simple script that cleans up the data of all patients.

## /view folder
This folder contains the scripts that define the User Interface of the application. The scripts are distributed into three seperate sub-folders depending on their type: "/html" for the HTML pages, "/javascript" for the controllers (MVC design) and "/css" for the look and feel. Note that the UI is leveraging a subset of scriptr.io's UI component, which has been pre-packed for this demo application.

### /view/html

Based on your selected entry point the below pages will be parsed with the appropriate theme.

- /view/html/index.html: this page is the template of the application's UI: it is composed of a header, a menu on the left-side, and a content section, within which different pages will be displayed depending on the action triggered by the user of the application.

#### /view/html/views/main
- view/html/views/main/main.html: the main content, composed of a map widget showing the location of the patient (assuming the devices are sending location data, currently we are topping up the patient info with simulated location data).
- view/html/views/main/info_generic.html: this is an info window shown when clicking on a device marker on the map
- /html/views/main/dashboard.html:  the dashboard that displays the latest values received from the patient devices as well as the historical data (i.e. the different values through time)

#### /view/html/
- /view/html/views/alerts/alerts.html: grid that displays the list of alerts that were generated when receiving patient devices data (alerts are generated depending on the business rules defined in "/entities/rules/alerts"
- Columns displayed in the alerts grid are defined in the <app-theme>/view/javascript/constants unders alertsGrid key
```
   alertsGrid: [
      
  ]
  
```
The field entry for each column definition refers to the data stored to each device event. 

### /view/javascript
The device-agnostic-app application leverages Angular.js and therefore adopts the corresponding MVC implementation. This folder contains the definition of the application's controllers.

- view/javascript/module.js: implements the routing logic of the menu
- view/javascript/controller.js: the main controller of the application
- view/javascript/layout.js: defines the items used in the header, menu and header of the application
- view/javascript/config.js: configuration of the application (http and websocket providers)

