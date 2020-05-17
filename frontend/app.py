import os
from werkzeug.utils import secure_filename
from flask import Flask, request, redirect, url_for, render_template, json, flash, make_response, send_from_directory, jsonify
import pandas as pd
import config

app = Flask(__name__)
app.secret_key = config.SECRET_KEY
app.config['data_dir'] = './data'


@app.route('/show_covid')
def show_covid_viz():
    return render_template('show_covid.html')


@app.route('/load_covid_data', methods=['GET', 'POST'])
def load_covid_data():

    # Get start date
    start_date = '2020-01-22'

    # Load data
    data_str = load_covid_data_from_csv(start_date)

    return data_str


def load_covid_data_from_csv(start_date):
    data_filename = os.path.join(app.config['data_dir'], 'time_series_covid19_confirmed_US.csv')
    df = pd.read_csv(data_filename)
    data_str = df.to_json()
    return data_str


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
