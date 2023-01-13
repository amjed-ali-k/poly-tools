#!/usr/bin/env bash

pip install -r requirements.txt
# create executable for windows (.exe) and linux from main.py
pyinstaller --onefile --windowed --icon=favicon.ico main.py -n "SBTE Helper"
