#!/usr/bin/python
import MySQLdb
import csv


db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="admin",  # your password
                     db="Schedules",        # name of the data base
                     use_unicode=True, 
                     charset="utf8")

with open('activitiesForDB.csv', 'r') as file:
    reader = csv.reader(file)

    cur = db.cursor()
    sql = "INSERT INTO `schedule2020` (`facility`, `facilityLink`, `activity`, `date`, `startTime`, `endTime`, `details`, `detailsLink`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"


    firstRow = True
    for row in reader:
        if firstRow == False:
            val = (
                # facility
                row[0], 
                # facilityLink
                row[1], 
                # activity
                row[2], 
                # DATE
                row[3], 
                # startTime
                row[4], 
                # endTime
                row[5], 
                # details 
                row[7], 
                # detailsLink 
                row[8]) 

            cur.execute(sql, val)
        elif firstRow == True:
            print('firstRow == False')
            firstRow = False

# you must create a Cursor object. It will let
#  you execute all the queries you need
# cur = db.cursor()

# Use all the SQL you like
# cur.execute("SELECT * FROM YOUR_TABLE_NAME")

# print all the first cell of all the rows
#for row in cur.fetchall():
#    print row[0]

db.commit()
db.close()