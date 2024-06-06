#!/usr/bin/python3
"""
Init Flask Web App
"""
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
import uuid

app = Flask(__name__)


@app.teardown_appcontext
def close_db(error):
    """
    Stop/remove running SQLAlchemy
    """
    storage.close()


@app.route('/101-hbnb/', strict_slashes=False)
def hbnb():
    """Serve it"""
    states = storage.all(State).values()
    states = sorted(states, key=lambda j: j.name)
    stdict = []

    for state in states:
        stdict.append([state, sorted(state.cities, key=lambda j: j.name)])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda j: j.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda j: j.name)

    return render_template('0-hbnb.html',
                           states=stdict,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid.uuid4())


if __name__ == "__main__":
    """Main"""
    app.run(host='0.0.0.0', port=5001)
