import requests
import urllib.request
import time
from bs4 import BeautifulSoup
from pprint import pprint
import csv


pageNum = 0
with open('activities.csv', 'w', newline='') as csvfile:

    writer = csv.writer(csvfile, dialect='excel')
    writer.writerow(['Facility', 'Facility-link', 'Facility-Activity', 'Date', 'Time', 'Details', 'details-link'])
    while True:
        url = 'https://ottawa.ca/en/recreation-and-parks/drop-in-programs?ignore_f_params=1&page=' + str(pageNum)
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        emptyDivs = soup.find_all("div", class_="view-empty")
        rows = soup.find("tbody").find_all("tr")
        
        if len(emptyDivs) == 1:
            break

        csvRows = []

        print(pageNum)
        print('------------------------------------------------')
        for row in rows:
            cells = row.find_all("td")


            for entry in cells:
                
                text = entry.get_text().strip()
                if "(link is external)" in text:
                    index = text.find('(')
                    text = text[:index - 1]
                    
                if "," in text:
                    text = text.replace(',', '', 1)
                    
                csvRows.append(text)
                
                if entry.find("a"):
                    csvRows.append(entry.find("a")['href'])
            
            writer.writerow(csvRows)
            pprint(csvRows)
            csvRows = []

            
        print('------------------------------------------------')
        pageNum += 1

