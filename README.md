This is the repo for CMPS 183 project.  The code written by the project group is located on branch ddavisscott-patch-2.
According to the sponser's request, we have to put our work on the previous website's repo, yet we commit a starting point for our project, and since all the functionalities on base on the database that we have which the size has exceed the limitation of github, the code for dashboard here might not run properly. Please access our website to see the actual result or run the w2p file which contains some part of our sample data  (a year).
***When Installing the .w2p file, please install it with the name 'SEAD', otherwise some logos might not shows up in this version.

The app can be accessed here - hotkeycc.com:9000/


Team Member UCSC ID's: okdogulu, bhaile, bsingh4, ylin62, aljdunca.

Landing Page:
    For the landing page everything works as intended when tested by the group.  The video button didn't work during presentation, but it has worked everytime before and everytime after.  (Video exits automatically upon ending)  It may have just been a loading issue.
For the login/sign-up page Facebook and google login do not work.

Dashboard:
    Dashboard page right now has few API that have not been implemented properly yet,
      add/del room and module(graph boxes):
          even though front-end has all the function written, to not let the demo user change our database, we decide to truncate the room_structure everytime so that even though some of these function might work in the front-end, but backend will not process it.
      querying one day usage:
          One day querying was still functional until the last day, yet we modified some structure of the back-end and unfortunatley some problems occurs. This query will query the raw data from db.device_usage and then aggregate it into our format and send it back to client side. The general query for more than one day is functional properly, so playing around with the custom range is still a choice.
