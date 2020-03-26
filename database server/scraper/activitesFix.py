import csv
import calendar

def convert24(str1): 
    
    str1 = '{0}'.format(str1.split(':')[0].zfill(2)) + ":" + str1.split(':')[1]
	
	# Checking if last two elements of time 
	# is AM and first two elements are 12 
    if str1[-2:] == "am" and str1[:2] == "pm": 
		return "00" + str1[2:-2] 
		
	# remove the AM	 
    elif str1[-2:] == "am": 
		return str1[:-2] 
	
	# Checking if last two elements of time 
	# is PM and first two elements are 12 
    elif str1[-2:] == "pm" and str1[:2] == "12": 
		return str1[:-2] 
    else: 
		# add 12 to hours and remove PM 
		return str(int(str1[:2]) + 12) + str1[2:5] 

def monthFormat(month):
    months = dict((v,k) for k,v in enumerate(calendar.month_name))
    return str(months[month])

def dateConvert(date):
    date_list = date.split()
    month = monthFormat(date_list[1])
    return "2020" + "-" + '{0}'.format(month.zfill(2)) + '-' + '{0}'.format(str(date_list[2]).zfill(2))

with open('activities.csv', 'r') as file_in, open("activitiesForDB", "w") as file_out:
    reader = csv.reader(file_in)
    writer = csv.writer(file_out)
    firstRow = False

    for row in reader:
        if firstRow == False:
            writer.writerows([row])
            firstRow = True
            for i in range(len(row)):
                if row[i] == "Date":
                    dateIndex = i
                elif row[i] == "Time":
                    timeIndex = i
                elif row[i] == "Time-start":
                    timeStart = i
                elif row[i] == "Time-end":
                    timeEnd = i
                    
        elif firstRow == True:
            row[dateIndex] = dateConvert(row[dateIndex])
            row[timeStart] = convert24(row[timeIndex].split(" - ")[0])
            row[timeEnd] = convert24(row[timeIndex].split(" - ")[1])
            writer.writerows([row])


