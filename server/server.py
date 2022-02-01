import os
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from resources.chat import Chat

app = Flask(__name__)
CORS(app)
api = Api(app)

##
## Actually setup the Api resource routing here
##
api.add_resource(Chat, '/chat')

port = os.environ['PORT'] if os.environ['PORT'] else 5000

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=port, debug=True)
