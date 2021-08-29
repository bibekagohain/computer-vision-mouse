import pyautogui
from flask import Flask


app = Flask(__name__)

pc_res_x = 1920
pc_res_y = 1080
ratio_x = 1.13
ratio_y = 1.11


p_x = 10
p_y = 10

@app.route("/data/<float:x>/<float:y>/<int:left_click>/<int:right_click>")
def controlPointer(x,y,left_click,right_click):
    x = x-200
    y -= 300
    global p_x
    global p_y
    #move cursor
    if(abs(p_x-x) >2 and abs(p_y - y) > 2):
        p_x = x
        p_y = y
        pyautogui.moveTo((pc_res_x-x*ratio_x), y*ratio_y)

    #left click
    if left_click == 1:
        pyautogui.click()
    
    #right click
    if right_click == 1:
        pyautogui.click(button='right')

    return "success"