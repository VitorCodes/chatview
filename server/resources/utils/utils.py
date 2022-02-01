import json
from werkzeug.wrappers import Request
from typing import Dict
from datetime import datetime
from pandas.core.frame import DataFrame
import pandas as pd

ALLOWED_EXTENSIONS = {'json'}

def request_files_to_json(request: Request, files_key: str):
    files = request.files.getlist(files_key)

    parsed = []
    
    for file in files:
        if file and allowed_file(file.filename):
            parsed.append(json.load(file))

    return parsed

def allowed_file(filename: str):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def decode_utf8_text(text: str, codec: str = 'latin1'):
    return text.encode(codec).decode('utf8')

def sort_dict(dict: Dict, descending = True):
    return sorted(dict.items(), key=lambda x: x[1], reverse=descending)

def sort_dict_num_keys(dict: Dict, descending = True):
    return sorted(dict.items(), key=lambda x: int(x[0]), reverse=descending)

def date_from_timestamp(timestamp: float):
    return datetime.fromtimestamp(timestamp / 1000)

def date_diff(start_date: datetime, end_date: datetime): 
    if start_date > end_date:
        raise ValueError(f"Start date {start_date} is not before end date {end_date}")

    seconds = (end_date - start_date).total_seconds()
    years = seconds // 3.154e+7
    seconds %= 3.154e+7
    months = seconds // 2592000
    seconds %= 2592000
    days = seconds // 86400
    seconds %= 86400
    hours = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60

    return {
        'years': int(years),
        'months': int(months),
        'days': int(days),
        'hours': int(hours),
        'minutes': int(minutes),
        'seconds': int(seconds)
    }

def json_date(date: datetime):
    return {
        'year': date.year,
        'month': date.month,
        'day': date.day
    }

def get_total_emojis(chat_dataframe: DataFrame):
    df = pd.json_normalize(chat_dataframe.loc[chat_dataframe['content'].notnull()]['content'])
    return int(df['emoji_count'].sum())