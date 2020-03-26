#!/usr/bin/python
import MySQLdb
import csv


db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="admin",  # your password
                     db="Schedules")        # name of the data base

with open('activities.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# you must create a Cursor object. It will let
#  you execute all the queries you need
# cur = db.cursor()

# Use all the SQL you like
# cur.execute("SELECT * FROM YOUR_TABLE_NAME")

# print all the first cell of all the rows
#for row in cur.fetchall():
#    print row[0]

db.close()