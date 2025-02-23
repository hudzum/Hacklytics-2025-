import requests

#returns list wehre first double is average of Avg_Sbmtd_Chrg(charge before insurance) and the second oen is Avg_Mdcr_Pymt_Amt which is the total amount the patient needs to pay our of pocket
def call_api(cpt_code):
    url = rf"https://data.cms.gov/data-api/v1/dataset/92396110-2aed-4d63-a6a2-5d6207d46a29/data?keyword={cpt_code}&offset=0&size=10"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        total_submitted = 0
        total_medicare = 0
        count = 0

        for line in data:
            if 'Avg_Sbmtd_Chrg' in line and 'Avg_Mdcr_Pymt_Amt' in line:
                try:
                    total_submitted += float(line['Avg_Sbmtd_Chrg'])
                    total_medicare += float(line['Avg_Mdcr_Pymt_Amt'])
                    count += 1
                except ValueError:
                    print(f"Skipping invalid entry number {count} for {cpt_code}")
        
        if count > 0:
            avg_submitted = total_submitted / count
            avg_medicare = total_medicare / count
            return [avg_submitted, avg_medicare]
        else:
            print("No valid data found.")
            return None
    
    else:
        print(f"Failed to connect to the API. Status code: {response.status_code}")
        return None



prices = call_api("486484684846") 
print(prices)

'''
#Lists individual costs instead of the averages. Note that there is some main code at the bottom

def test_call_api(cpt_code):
    url = rf"https://data.cms.gov/data-api/v1/dataset/92396110-2aed-4d63-a6a2-5d6207d46a29/data?keyword={cpt_code}&offset=0&size=10"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        
        for line in data:
            print(line)
            
            if 'Avg_Sbmtd_Chrg' in line and 'Avg_Mdcr_Pymt_Amt' in line:
                total_submitted = float(line['Avg_Sbmtd_Chrg'])
                total_medicare = float(line['Avg_Mdcr_Pymt_Amt'])
                print(total_submitted)
                print(total_medicare)
'''