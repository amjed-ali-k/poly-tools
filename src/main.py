#  ----- Author Details  ---------
#          Amjed Ali K
#  https://github.com/amjed-ali-k
#  -------------------------------


# DONT TOUCH CODES BELOW
import csv
import os
import questionary
import humanize


# SECTION 0

print(
    """
███████╗██████╗ ████████╗███████╗    ██████╗ ███████╗███████╗██╗   ██╗██╗  ████████╗    ██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ 
██╔════╝██╔══██╗╚══██╔══╝██╔════╝    ██╔══██╗██╔════╝██╔════╝██║   ██║██║  ╚══██╔══╝    ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗
███████╗██████╔╝   ██║   █████╗      ██████╔╝█████╗  ███████╗██║   ██║██║     ██║       ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝
╚════██║██╔══██╗   ██║   ██╔══╝      ██╔══██╗██╔══╝  ╚════██║██║   ██║██║     ██║       ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗
███████║██████╔╝   ██║   ███████╗    ██║  ██║███████╗███████║╚██████╔╝███████╗██║       ██║  ██║███████╗███████╗██║     ███████╗██║  ██║
╚══════╝╚═════╝    ╚═╝   ╚══════╝    ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝╚═╝       ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝                              
                                      
 ▄▀█ █▀▄▀█ ░░█ █▀▀ █▀▄ ▄▀█ █░░ █ ░ █▄▀
 █▀█ █░▀░█ █▄█ ██▄ █▄▀ █▀█ █▄▄ █ ▄ █░█

Created by Amjed Ali K (https://github.com/amjed-ali-k) 

`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````                                                                                                                                 
    """
)


def proccess_result():
    # List existing csv files with its file size in current directory and select one of them using questionary
    # Choices are in format of "file_name (file_size)"
    # Listed files exclude output files

    choices = []
    for file in os.listdir():
        if (
            file.endswith(".csv")
            and not file.startswith("Sorted")
            and not file.startswith("Grades")
        ):
            choices.append(
                file + " (" + humanize.naturalsize(os.path.getsize(file)) + ")"
            )
    if choices == []:
        print("No csv files found in current directory")
        # wait for user to press enter
        input("Press Enter to exit...")
        return

    # Ask input of file name and validate using questionary
    input_file = questionary.select("Select Input File", choices=choices).ask()

    # Remove file size from input_file
    input_file = input_file.split(" (")[0]

    # Ask input of Semester (1 - 6) and validate using questionary
    semester = questionary.select(
        "Select Semester", choices=["1", "2", "3", "4", "5", "6"]
    ).ask()

    # Ask input of Exam Month (Nov, Apr) and validate using questionary
    exam_month = questionary.select("Select Exam Month", choices=["Nov", "Apr"]).ask()

    # Ask input of Year (2021, 2022, 2023, 2024) and validate using questionary
    year = questionary.select(
        "Select Year of exam", choices=["2021", "2022", "2023", "2024"]
    ).ask()

    # Ask if Supplymentry is to be excluded and validate using questionary
    exclude_supplymentry = questionary.select(
        "Exclude Supplymentry?", choices=["Y", "N"]
    ).ask()

    # Convert exclude_supplymentry to boolean
    if exclude_supplymentry == "Y":
        exclude_supplymentry = True
    else:
        exclude_supplymentry = False

    # Create output file name
    output_file = (
        "Sorted_S" + semester + "_Result-" + exam_month + "-" + year + "-Grades.csv"
    )
    grades_sheet = "Analysis-S" + semester + "-" + exam_month + "-" + year + ".csv"

    # SECTION I

    data = {}
    f = open(input_file, "r")
    reader = csv.reader(f)
    next(reader)
    subjects = []
    for item in reader:
        if exclude_supplymentry and item[5] != "Regular":
            continue
        if not item[0] in data:
            data[item[0]] = {
                "Branch": item[2],
                "Name": item[1],
                "Semester": item[3],
            }
        if item[9] == "F" and item[6] == "Absent":
            data[item[0]][item[4]] = "Absent"
        else:
            data[item[0]][item[4]] = item[9]
        if item[7] == "Withheld":
            data[item[0]][item[4]] = "Withheld"

        if item[7] == "With held for Malpractice":
            data[item[0]][item[4]] = "F"

        if item[4] not in subjects:
            subjects.append(item[4])
    f.close()

    #  SECTION II

    # create new directory for output files
    if not os.path.exists("Output"):
        os.mkdir("Output")

    f = open("Output/" + output_file, "w")
    writer = csv.writer(f)
    writer.writerow(["RegNo", "Name", "Branch", "Semester"] + subjects)
    for key in data:
        row = []
        row.append(key)
        row.append(data[key]["Name"])
        row.append(data[key]["Branch"])
        row.append(data[key]["Semester"])
        for sub in subjects:
            if sub in data[key]:
                row.append(data[key][sub])
            else:
                row.append("Not Found")
        writer.writerow(row)

    # SECTION III

    status = {}
    for sub in subjects:
        status[sub] = {}
    for key in data:
        val = data[key]
        for sub in subjects:
            if sub in val:

                if val[sub] in status[sub]:
                    status[sub][val[sub]] += 1
                else:
                    status[sub][val[sub]] = 1

    # SECTION IV

    f = open("Output/" + grades_sheet, "w")
    writer = csv.writer(f)
    grades = ["S", "A", "B", "C", "D", "E", "F", "Absent", "Withheld"]

    writer.writerow(
        [
            "Subject",
        ]
        + grades
    )
    for key in status:
        row = []
        row.append(key)
        for grade in grades:
            if grade in status[key]:
                row.append(status[key][grade])
            else:
                row.append(0)

        writer.writerow(row)

    total_passed = 0
    total_failed = 0
    total_withheld = 0
    for key in data:
        isFailed = False
        isWithheld = False
        for sub in data[key]:
            if sub in subjects:
                if data[key][sub] == "F" or data[key][sub] == "Absent":
                    isFailed = True
                if data[key][sub] == "Withheld":
                    isWithheld = True
        if isFailed:
            total_failed += 1
        elif isWithheld:
            total_withheld += 1
        else:
            total_passed += 1

    writer.writerow(["Total Passed", total_passed])
    writer.writerow(["Total Failed", total_failed])
    writer.writerow(["Total Withheld", total_withheld])
    writer.writerow(
        ["Pass Percentage", (total_passed / (total_failed + total_passed)) * 100]
    )

    f.close()

    print("FILES CREATED SUCCESSFULLY")
    print("Sorted File: " + output_file)
    print("Grades Sheet: " + grades_sheet)


if __name__ == "__main__":

    # Run the program and repeat it if user wants to
    while True:
        proccess_result()
        if (
            questionary.select(
                "Do you want process another file?", choices=["Y", "N"]
            ).ask()
            == "N"
        ):
            break
