import http
import os

# getExecuteScriptList
# list:
# 	
# 
def httpClient():
    hc = httplib.HTTPConnection('www.cwi.nl', 80, timeout=10)
    hc.request("GET", "/")
	r1 = hc.getresponse()
	data2 = r2.read()
	hc.close
	return data2

def download_file():

def execute_script(script, args):

def put_execute_result():


	
# pubExecuteScritResult
