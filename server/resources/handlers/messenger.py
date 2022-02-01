from emoji.core import emoji_count, emoji_lis
from flask import jsonify
from pandas.core.frame import DataFrame
from typing import Dict, List, Iterable
from datetime import datetime
import pandas as pd
import numpy as np
import math
from werkzeug.wrappers import Request
from ..utils import utils


class MessengerChat:
    messages = []
    participants = set()
    data = DataFrame()

    def __init__(self, request: Request, files_key: str = 'files'):
        parsed_files = utils.request_files_to_json(request, files_key)
        self.setup_chat(parsed_files)
        self.setup_chat_dataframe(self.messages)

    def setup_chat(self, parsed_files: List):
        """[summary]
        Iterates a list of .json messenger chat files and stores all messages
        and participants in the local variables

        Args:
            parsed_files (List): [description]
        """
        self.messages = []
        self.participants = set()

        for parsed_file in parsed_files:
            for participant in parsed_file['participants']:
                self.participants.add(participant['name'])

            self.messages += parsed_file['messages']

    def nullcheck_dataframe_columns(self, dataframe: pd.DataFrame, columns: List[str]):
        for column in columns:
            if(column not in dataframe.columns):
                dataframe[column] = np.nan

    def setup_chat_dataframe(self, messages: List):
        """[summary]
        Transforms a chat message list into a panda dataframe.
        The dataframe has the columns:
        [sender_name, timestamp_ms, photos, type, content, gifs, reactions]

        1. Sorts messages by their timestamps, ascending
        2. Adds total gif and photo counts to the dataframe
        3. Decodes each message and adds the emojis found to the dataframe

        Args:
            messages (List): [description]

        Returns:
            [type]: [description]
        """
        self.data = pd.json_normalize(messages).sort_values(
            by='timestamp_ms',
            ascending=True)  # Order by timestamps, ascending

        self.nullcheck_dataframe_columns(self.data, ['gifs', 'photos', 'reactions'])
        self.data = self.apply_list_count(self.data, ['gifs', 'photos'])  # Apply total gifs and total photos to dataframe
        self.data = self.apply_text_decode(self.data,['content'])  # Apply emoji count and list emojis for each content message
        self.data['reactions'] = self.data['reactions'].transform(
            lambda reactions: len(reactions)
            if type(reactions) is list else None)

        self.data = self.data[[
            'sender_name', 'timestamp_ms', 'photos', 'type', 'content', 'gifs',
            'reactions'
        ]]
        return self.data

    def apply_list_count(self, dataframe: pd.DataFrame, columns: List[str]):
        """[summary]
        Apply a list count to the specified dataframe column items.
        These items are expected to be of type List.

        Args:
            dataframe (pd.DataFrame): [description]
            columns (List[str]): [description]

        Returns:
            [type]: [description]
        """
        for column in columns:
            if(column in dataframe):
                dataframe[column] = dataframe[column].apply(
                    lambda value: len(value) if type(value) is list else None)

        return dataframe

    def apply_text_decode(self, dataframe: pd.DataFrame, columns: List[str]):
        """[summary]
        Save and decode all chat messages for the specified dataframe columns.

        Args:
            dataframe (pd.DataFrame): [description]
            columns (List[str]): [description]

        Returns:
            [type]: [description]
        """
        for column in columns:
            dataframe[column] = dataframe[column].apply(
                lambda value: self.parse_message_content(value)
                if type(value) is str else None)

        return dataframe

    def parse_message_content(self, text: str):
        """
        Decodes a text string into a collction containing the text and
        additionally, the emoji_count and emoji_list.

        Args:
            text (str): [description]

        Returns:
            [type]: [description]
        """
        emojis = emoji_lis(utils.decode_utf8_text(text))

        return {
            'text': text,
            'emoji_count': emoji_count(utils.decode_utf8_text(text)),
            'emoji_list': [emoji['emoji'] for emoji in emojis]
        }

    def get_participant_emojis(self, emoji_list: Iterable,
                               all_emojis_sent: Dict):

        """[summary]
        Iterates an emoji_list and counts each emoji by adding to the
        all_emojis_sent dictionary on each iteration.

        Returns:
            [type]: [description]
        """
        emojis = {}

        for _, value in emoji_list:
            for item in value:
                if (item in emojis):
                    emojis[item] += 1
                else:
                    emojis[item] = 1

                if (item in all_emojis_sent):
                    all_emojis_sent[item] += 1
                else:
                    all_emojis_sent[item] = 1

        return emojis

    def get_participant_messages_per_day(self, participant_data: DataFrame):
        """[summary]
        Transforms a chat participant data into a dictionary that represents
        each date where that participant sent a message, and for each date,
        the hour the message was sent.

        Args:
            participant_data (DataFrame): [description]

        Returns:
            [type]: [description]
        """
        msg_per_day = {}

        for _, value in participant_data['timestamp_ms'].iteritems():
            dt = datetime.fromtimestamp(value / 1000)
            dt_key = f'{dt.year}-{dt.month}-{dt.day}'
            hr_key = dt.hour

            if (dt_key in msg_per_day):
                if (hr_key in msg_per_day[dt_key]):
                    msg_per_day[dt_key][hr_key] += 1
                else:
                    msg_per_day[dt_key][hr_key] = 1
            else:
                msg_per_day[dt_key] = {hr_key: 1}

        return msg_per_day

    def get_participant_stats(self, participant: str, msg_per_day: Dict,
                              emojis: Dict, participant_data: DataFrame,
                              content_data: DataFrame):
        """[summary]
        Assembles a set of participant statistics into a json-ready format
        payload.

        Args:
            participant (str): [description]
            msg_per_day (Dict): [description]
            emojis (Dict): [description]
            participant_data (DataFrame): [description]
            content_data (DataFrame): [description]

        Returns:
            [type]: [description]
        """
        return {
            'name': utils.decode_utf8_text(participant),
            'total_messages_sent': len(participant_data.index),
            'reactions_received': int(participant_data['reactions'].sum()),
            'gifs_sent': int(participant_data['gifs'].sum()),
            'photos_sent': int(participant_data['photos'].sum()),
            'links_shared': len(participant_data[participant_data['type'] == 'Share'].index),
            'total_emojis_sent': int(content_data['emoji_count'].sum()),
            'top_emojis_sent': emojis[:10],
            # 'messages_sent': msg_per_day,
        }

    def add_messages_to_weekday(self, date: str, current_weekday_messages: Dict, total_messages: int):
        """[summary]
        From a date's weekday, check if it exists in the dictionary and
        adds the messages_to_add amount to that weekday

        Args:
            date (str): [description]
            current_weekday_messages (Dict): [description]
            total_messages (int): [description]
        """
        weekday = datetime.strptime(date, '%Y-%m-%d').weekday() # monday is 0, sunday is 6
        if(weekday not in current_weekday_messages):
            current_weekday_messages[weekday] = total_messages
        else:
            current_weekday_messages[weekday] += total_messages

    def add_messages_to_dict(self, key: str, current_messages: Dict, messages_to_add: int):
        """[summary]
        Checks if a key exists in a dictionary and adds the messages_to_add 
        amount to that key

        Args:
            key (str): [description]
            current_messages (Dict): [description]
            messages_to_add (int): [description]
        """
        if(key not in current_messages):
            current_messages[key] = messages_to_add
        else:
            current_messages[key] += messages_to_add

    def add_participant_message_stats(self, participant_messages: Dict, message_stats: Dict):
        """[summary]
        Adds message statistics to message_stats for the participant.
        These statistics consist messages per year/month, messages per date,
        messages per weekday and messages per hour

        Args:
            participant_messages (Dict): [description]
            message_stats (Dict): [description]
        """
        for date in participant_messages:
            year, month, day = date.split('-')

            if(year not in message_stats['year_month_messages']):
                message_stats['year_month_messages'][year] = { month: 0 }
                
            if(month not in message_stats['year_month_messages'][year]):
                message_stats['year_month_messages'][year][month] = 0

            for hour in participant_messages[date]:
                total_hour_messages = participant_messages[date][hour]

                # Add messages per month and year
                message_stats['year_month_messages'][year][month] += total_hour_messages

                # Add messages per weekday
                self.add_messages_to_weekday(date, message_stats['weekday_messages'], total_hour_messages)
                
                # Add messages per date
                self.add_messages_to_dict(date, message_stats['day_messages'], total_hour_messages)
                
                # Add messages per hour
                self.add_messages_to_dict(hour, message_stats['hour_messages'], total_hour_messages)

    def get_participants_stats(self):
        """[summary]
        Iterates the participants list and returns a list of participants 
        and their statistics, as well as statistics that refer the whole
        conversation (such as all_emojis_sent).

        Returns:
            [type]: [description]
        """
        all_emojis_sent = {}
        message_stats = { 
            'year_month_messages': {},
            'day_messages': {},
            'weekday_messages': {},
            'hour_messages': {}
        }
        participants_stats = []

        for participant in self.participants:
            participant_data = self.data.query(
                f'sender_name == "{participant}"'
            )  # Filter data for this participant
            content_data = pd.json_normalize(
                participant_data.loc[participant_data['content'].notnull()]
                ['content'])  # Filter content only

            self.nullcheck_dataframe_columns(content_data, ['emoji_list', 'emoji_count'])

            # Count all emojis separately in a set for this participant
            emoji_list = content_data['emoji_list'].iteritems()

            emojis = utils.sort_dict(
                self.get_participant_emojis(emoji_list, all_emojis_sent))

            # Count messages per day and hour
            msg_per_day = self.get_participant_messages_per_day(
                participant_data)

            # Adds participant message statistics to message_stats
            self.add_participant_message_stats(msg_per_day, message_stats)

            participants_stats.append(
                self.get_participant_stats(participant, msg_per_day, emojis,
                                           participant_data, content_data))

        different_emojis = len(all_emojis_sent.keys())
        all_emojis_sent = utils.sort_dict(all_emojis_sent)
        avg_messages_per_day = math.floor((sum(message_stats['day_messages'].values())) / (len(message_stats['day_messages'].keys())))
        top_messages_per_day = utils.sort_dict(message_stats['day_messages'])
        messages_per_year_month = self.sort_year_month_messages(message_stats['year_month_messages'])
        weekday_messages = message_stats['weekday_messages']
        hour_messages = message_stats['hour_messages']
        
        return (all_emojis_sent, different_emojis, participants_stats, avg_messages_per_day, top_messages_per_day, messages_per_year_month, weekday_messages, hour_messages)

    def sort_year_month_messages(self, messages: Dict):
        """[summary]
        Sorts year dict and month total messages dicts ascending.
        Dict follows the structure: { 'year_number': { 'month_number': total_messages } }

        Args:
            messages (Dict): [description]

        Returns:
            [type]: [description]
        """
        for year in messages:
            messages[year] = utils.sort_dict_num_keys(messages[year], descending=True)

        return utils.sort_dict_num_keys(messages, descending=False)

    def to_json(self):
        """[summary]
        Takes messages, participant and data variables and creates 
        a json payload for the messenger chat.

        Returns:
            [type]: [description]
        """
        stats = {}

        all_emojis_sent, different_emojis, participants_stats, avg_messages_per_day, top_messages_per_day, messages_per_year_month, weekday_messages, hour_messages = self.get_participants_stats()
        start_date = utils.date_from_timestamp(
            float(self.data.iloc[0]['timestamp_ms']))
        end_date = utils.date_from_timestamp(
            float(self.data.iloc[-1]['timestamp_ms']))

        stats = {
            'participants': participants_stats,
            'total_messages': len(self.data.index),
            'photos': int(self.data['photos'].sum()),
            'total_emojis': utils.get_total_emojis(self.data),
            'top_emojis': all_emojis_sent[:10],
            'top_messages_per_day': top_messages_per_day[:10],
            'messages_per_year_month': messages_per_year_month,
            'weekday_messages': weekday_messages,
            'hour_messages': hour_messages,
            'different_emojis_used': different_emojis,
            'avg_messages_per_day': avg_messages_per_day,
            'reactions': int(self.data['reactions'].sum()),
            'start_date': utils.json_date(start_date),
            'end_date': utils.json_date(end_date),
            'duration': utils.date_diff(start_date, end_date),
            'total_links_shared': len(self.data[self.data['type'] == 'Share'].index)
        }

        return jsonify(stats)