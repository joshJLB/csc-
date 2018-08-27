## Prerequisites

1. docker and docker-compose installed and available on the command line. (run: `docker —version && docker-compose —version` to make sure they are installed)

2. A Bitbucket account that is a part of the JLB team

3. A new Bitbucket repo for your project within the scope of that team


### To set up local dev environment

1. git clone git@github.com:collinjlb/docker-locker.git PROJECT_NAME/FOLDER_NAME

2. 'cd FOLDER_NAME && rm -rf .git`

3. 'git init && git remote add origin YOUR_NEW_BITBUCKET_REPO_URL_HERE`

4. open  `docker-compose.yml` file & change all instances of `test` with the name of your project

5. check running docker containers `docker container ls`
 'docker stop $(docker ps -aq)' to stop all containers
 'docker rm $(docker ps -aq)' to remove all containers

6. if `phpmyadmin` and `db` containers are not active then `docker-compose -f dev-database.yml up -d --build`

7. ensure that http://localhost:8080 takes you to `phpmyadmin`

8. `docker-compose up -d —build`

9. browse to http://localhost

10. run through installer ( may take a second to load )

11. after successful WP install run `docker exec -it YOUR_PROJECT_NAME/FOLDER_NAME bash` (IF USING WINDOWS: run: `winpty docker exec -it YOUR_CONTAINER_NAME/CONTAINER_ID bash`)

12. you should now enter a new command line instance within your project’s Wordpress container

13. run 'chmod -R 777 *'

14. `startup`

15. 'serve'


#### Ensure that JLBTheme is being tracked in repository

1. Open a new terminal && cd PROJECT_NAME/FOLDER_NAME/themes/JLBTheme && rm -rf .git


### Move Site to Server

1. go to phpmyadmin and export local database .sql file

2. open .sql file in text-editor and find & replace two things:
  a. localhost: jlbdev1.net/$project/public_html
  b. utf8mb4_unicode_$number_ci: utf8mb4_unicode_ci

3. navigate to 192.168.7.26/phpmyadmin/ && create new user

4. import .sql file to new user

5. go through quick-server-start but do not wp-install! ( already created locally )

6. cd wp-content && git clone $project-repository

7. cd $project-repository && move all files into wp-content by ``` sudo mv -v * ../ ```

8. cd back to wp-content && ```sudo rm -rf $project-folder```

9. navigate to jlbdev1.net/$project/public_html/wp-admin in browser

10. upload plugins

11. go to settings > permalink && save changes

12. open project theme on server in text editor && search & replace localhost: jlbdev1.net/$project/public_html

13. cd themes/JLBTheme && addDevDependencies

14. add alias && source alias


### MySQL Backups

https://hub.docker.com/r/jswetzen/mysql-backup/
The `mysql-backup` folder containers one backup from every hour for the past ten hours. If you need to keep any of these backups long term make sure to copy them somewhere safe because backups older than 10 hours are deleted.

Refer to the documentation to see how to restore.

Basic gist is run: `docker exec backup ls /backup` to see available restore files.
Then run: `docker exec backup /restore.sh /backup/2015.08.06.171901.sql` with this line `2015.08.06.171901.sql` referring to the backup you want to restore to.

Alternatively use the SQL files with `phpmyadmin` at http://localhost:8080 to restore with.
