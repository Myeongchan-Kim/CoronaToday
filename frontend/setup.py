
import os, sys
import pandas as pd
import subprocess, shutil


def data_pull():
    os.chdir("../COVID-19")
    os.system("git pull origin master")
    os.chdir("../frontend")


def convert_data_file(src_filepath, dst_filepath):
    df = pd.read_csv(src_filepath, dtype=str)
    df = df.rename(columns={"Lat": "Lat_", "Long_": "Long_"})
    df.to_csv(dst_filepath, index=None)
    print("Successfully saved a file : {}".format(dst_filepath))


def setup_run():
    # Update the latest data
    data_pull()

    src_filepath = "../COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    dst_filepath = "../frontend/data/time_series_covid19_confirmed_US.csv"

    if not os.path.isdir(os.path.dirname(dst_filepath)):
        os.mkdir(os.path.dirname(dst_filepath))

    convert_data_file(src_filepath, dst_filepath)

    os.system("echo SECRET_KEY= > config.py")


if __name__ == "__main__":
    setup_run()