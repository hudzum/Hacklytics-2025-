import re
import json
from api.cms_api import call_api
from email_generator import generate_email

def compare_prices(rows):
  def is_fraud(bill_price: int, fair_price: int) -> int:
      """
      Categorizes the bill price based on how much it exceeds the fair price.
      :param bill_price: The price given on the bill.
      :param fair_price: The expected fair price.
      :return: 
          1 if the bill price is in the range [fair_price, fair_price * 1.10]
          2 if the bill price is in the range (fair_price * 1.10, fair_price * 2.5]
          3 if the bill price is above fair_price * 2.5
      """
      first_threshold = 1.5
      second_threshold = 3
      if fair_price <= bill_price <= fair_price * first_threshold:
          return 1  # Slightly above expected price (acceptable range)
      elif fair_price * first_threshold < bill_price <= fair_price *second_threshold:
          return 2  # Moderately above expected price (suspicious)
      else:
          return 3  # Too high (possible fraud)

  fraudulent_items = [[]]

  #set up json
  i=0
  for row in rows:
      cpt_code = row[2]
      if not cpt_code:
        cpt_code = desc_to_cpt(row[1]) 
      given_price = row[0]
      #use and extract price from api
      api_values = call_api(cpt_code)
      if not api_values:
        print(f"API request failed for item #{i}\n")
      if given_price < 0:
        print(f"Negative price for item #{i}\n")
      expected_price = api_values[0] - api_values[1]
      howFraudulent = is_fraud(given_price,expected_price, 0.3)
      '''
      if isFraudulent:
        fraudulent_item=[]
        fraudulent_item.append()
      '''
      print(f""howFraudulent)

 input = "[{'cost': '816.29', 'name': 'EKG/ECG (ELECTROCARDIOGRAM) -', 'code': None}, {'cost': '31,049.61', 'name': 'ANESTHESIA GENERAL CLASSIFI', 'code': None}, {'cost': '11,115.53', 'name': 'MEDICAL/SURGICAL SUPPLIES AND', 'code': None}, {'cost': '762.90', 'name': 'OCCUPATIONAL THERAPY - GENERA', 'code': None}, {'cost': '14,481.65', 'name': 'CT SCAN-GENERAL CLASSIFICAT', 'code': None}, {'cost': '1,139.25', 'name': 'PHYSICAL THERAPY - GENERAL CL', 'code': None}, {'cost': '11,152.32', 'name': 'PHARMACY GENERAL CLASSIFICA', 'code': None}, {'cost': '8,294.16', 'name': 'RADIOLOGY DIAGNOSTIC GENE', 'code': None}, {'cost': '36,089.15', 'name': 'MAGNETIC RESONANCE TECHNOLOGY', 'code': None}, {'cost': '5,358.41', 'name': 'GENERAL CLASSIFI', 'code': None}]"