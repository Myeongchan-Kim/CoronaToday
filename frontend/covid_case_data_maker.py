
import os, sys
import subprocess, shutil

if __name__ == "__main__":
    src_filepath = "../COVID-19/csse_covid_19_data/csse_covid_19_time_series.csv"
    dst_filepath = "data/csse_covid_19_time_series.csv"
    subprocess.run('cp', src_filepath, dst_filepath)