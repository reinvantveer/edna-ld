import json
import genson


class SchemaGenerator:
    @staticmethod
    def generate_schema(data):
        schema = genson.Schema()
        schema.add_schema({})

        # To get rid of nasty type errors, pingpong forth and back to JSON compatible: JSON
        json_data = json.dumps(data)
        dictionary = json.loads(json_data)
        schema.add_object(dictionary)

        return schema.to_dict()
