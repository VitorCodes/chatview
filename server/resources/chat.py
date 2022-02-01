from flask_restful import Resource, request
from .handlers.messenger import MessengerChat

class Chat(Resource):
    def post(self):
        return MessengerChat(request).to_json()